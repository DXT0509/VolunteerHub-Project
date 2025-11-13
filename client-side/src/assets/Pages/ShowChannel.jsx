import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Avatar, Divider, Snackbar, Alert, Slide, IconButton, Tooltip } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from 'react';

// Stable transition component defined outside so MUI can properly animate exit
const SlideFromTop = React.forwardRef(function SlideFromTop(props, ref) {
    return <Slide ref={ref} {...props} direction="down" timeout={{ enter: 400, exit: 350 }} />;
});

function ShowChannel() {
    const [data, setData] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState(['']);
    const [openComments, setOpenComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success'); // 'success' | 'warning'
    const [showAlert, setShowAlert] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [allowed, setAllowed] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePostId, setDeletePostId] = useState(null);

    // Redirect to login if not authenticated
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true, state: { from: `/exchange-channel/${id}` } });
        }
    }, [id, navigate]);

    // If logged in but not approved (joined) for this event, kick back to event detail
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return; // handled by previous effect
        // Fetch user registrations and check status for this event id
        fetch('http://localhost:4000/registrations/my', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.ok ? res.json() : [])
        .then(list => {
            const reg = Array.isArray(list) ? list.find(r => String(r.event_id) === String(id)) : null;
            if (!reg || reg.status !== 'approved') {
                // Optionally could show a warning alert before redirect; for now redirect immediately.
                navigate(`/events/${id}`, { replace: true, state: { reason: 'not_joined' } });
            }
        })
        .catch(() => {
            // On error, be safe and redirect back
            navigate(`/events/${id}`, { replace: true, state: { reason: 'check_failed' } });
        });
    }, [id, navigate]);
    const fetchPosts = useCallback(() => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:4000/channels/${id}/posts`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.error(err));
    }, [id]);
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, id]);

    const openForm = useCallback(() => {
        // Reset previous form state when opening
        setContent('');
        setAttachments(['']);
        setOpenCreate(true);
    }, []);
    const closeForm = useCallback(() => setOpenCreate(false), []);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const cleanedAttachments = attachments.filter(u => u && u.trim() !== '');
        if (!content.trim() && cleanedAttachments.length === 0) {
            // Client-side early validation matches backend rule
            setAlertType('warning');
            setAlertMessage('Bài viết phải có nội dung hoặc ít nhất một tệp đính kèm');
            setShowAlert(true);
            return;
        }
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:4000/channels/${id}/posts`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, attachments: cleanedAttachments })
        });
        if (res.ok) {
            setAlertType('success');
            setAlertMessage('Đăng bài thành công');
            setShowAlert(true);
        } else {
            // Backend error handling
            try {
                const data = await res.json();
                const msg = data?.error || 'Đăng bài thất bại';
                setAlertType('warning');
                setAlertMessage(msg);
                setShowAlert(true);
            } catch {
                setAlertType('warning');
                setAlertMessage('Đăng bài thất bại');
                setShowAlert(true);
            }
            return; // Don't refresh/close modal on failure
        }
        fetchPosts();
        closeForm();
    }, [attachments, closeForm, content, fetchPosts, id]);
    
    const addAttachmentField = () => setAttachments(prev => [...prev, '']);
    const removeAttachmentField = (index) => setAttachments(prev => prev.filter((_, i) => i !== index));

    const handleToggleLike = useCallback(async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/channels/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ postId })
            });
            if (!res.ok) return;
            const { liked } = await res.json();

            // Update local state for this post's like count and liked status
            setData(prev => {
                if (!prev?.items) return prev;
                return {
                    ...prev,
                    items: prev.items.map(p => {
                        if (p.id !== postId) return p;
                        const delta = liked ? 1 : -1;
                        return {
                            ...p,
                            liked,
                            _count: { ...p._count, likes: (p._count?.likes || 0) + delta }
                        };
                    })
                };
            });
            // Also update selectedPost if it's the one being liked
            setSelectedPost(prev => {
                if (!prev || prev.id !== postId) return prev;
                const delta = liked ? 1 : -1;
                return {
                    ...prev,
                    liked,
                    _count: { ...prev._count, likes: (prev._count?.likes || 0) + delta }
                };
            });
        } catch (e) {
            // noop
        }
    }, []);

    const openCommentsFor = useCallback((post) => {
        setSelectedPost(post);
        setOpenComments(true);
    }, []);
    const closeComments = useCallback(() => setOpenComments(false), []);

    // Apply a newly created comment to both selectedPost and data state
    const applyNewCommentToState = useCallback((postId, cmt) => {
        setSelectedPost(prev => prev && prev.id === postId ? {
            ...prev,
            comments: [...(prev.comments || []), cmt],
            _count: { ...prev._count, comments: (prev._count?.comments || 0) + 1 }
        } : prev);
        setData(prev => {
            if (!prev?.items) return prev;
            return {
                ...prev,
                items: prev.items.map(p => p.id === postId
                    ? { ...p, comments: [...(p.comments || []), cmt], _count: { ...p._count, comments: (p._count?.comments || 0) + 1 } }
                    : p)
            };
        });
    }, []);

    const handleToggleCommentLike = useCallback(async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/channels/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ commentId })
            });
            if (!res.ok) return;
            const { liked } = await res.json();

            setSelectedPost(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    comments: (prev.comments || []).map(c => {
                        if (c.id !== commentId) return c;
                        const curr = c._count?.likes || 0;
                        const delta = liked ? 1 : -1;
                        return { ...c, liked, _count: { ...c._count, likes: Math.max(0, curr + delta) } };
                    })
                };
            });
            setData(prev => {
                if (!prev?.items) return prev;
                return {
                    ...prev,
                    items: prev.items.map(p => ({
                        ...p,
                        comments: (p.comments || []).map(c => {
                            if (c.id !== commentId) return c;
                            const curr = c._count?.likes || 0;
                            const delta = liked ? 1 : -1;
                            return { ...c, liked, _count: { ...c._count, likes: Math.max(0, curr + delta) } };
                        })
                    }))
                };
            });
        } catch (e) {}
    }, []);

    const onSuccess = useCallback((msg) => {
        setAlertType('success');
        setAlertMessage(msg);
        setShowAlert(true);
    }, []);

    const posts = useMemo(() => data?.items || [], [data]);
    const currentUserId = useMemo(() => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u)?.id ?? null : null;
        } catch { return null; }
    }, []);

    const requestDeletePost = useCallback((postId) => {
        setDeletePostId(postId);
        setDeleteOpen(true);
    }, []);

    const closeDeleteConfirm = useCallback(() => {
        setDeleteOpen(false);
        setDeletePostId(null);
    }, []);

    const confirmDeletePost = useCallback(async () => {
        if (!deletePostId) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/channels/posts/${deletePostId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error('Xóa bài viết thất bại');
            // Update list and selected post
            setData(prev => {
                if (!prev?.items) return prev;
                return { ...prev, items: prev.items.filter(p => p.id !== deletePostId) };
            });
            setSelectedPost(prev => (prev && prev.id === deletePostId) ? null : prev);
            setOpenComments(prev => (prev && deletePostId) ? false : prev);
            setAlertType('success');
            setAlertMessage('Xóa bài viết thành công');
            setShowAlert(true);
        } catch (e) {
            setAlertType('warning');
            setAlertMessage(e?.message || 'Xóa bài viết thất bại');
            setShowAlert(true);
        } finally {
            closeDeleteConfirm();
        }
    }, [deletePostId, closeDeleteConfirm]);

    function formatRelative(timeString){
        try {
            const created = new Date(timeString);
            const now = new Date();
            const diffMs = now.getTime() - created.getTime();
            const minute = 60 * 1000;
            const hour = 60 * minute;
            const day = 24 * hour;
            const month = 30 * day; // approximate
            const year = 365 * day; // approximate
            if (diffMs < minute) return 'vừa xong';
            if (diffMs < hour) return `${Math.floor(diffMs / minute)} phút trước`; 
            if (diffMs < day) return `${Math.floor(diffMs / hour)} giờ trước`;
            if (diffMs < month) return `${Math.floor(diffMs / day)} ngày trước`;
            if (diffMs < year) return `${Math.floor(diffMs / month)} tháng trước`;
            return `${Math.floor(diffMs / year)} năm trước`;
        } catch { return ''; }
    }

    return (
        <Box sx={{ p: 2 }}>
            {/* Placeholder box */}
            <Snackbar
                open={showAlert}
                onClose={(_, reason) => {
                    if (reason === 'clickaway') return;
                    setShowAlert(false);
                }}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={SlideFromTop}
                TransitionProps={{ appear: true }}
                >
                <Alert
                    severity={alertType === 'success' ? 'success' : 'error'}
                    icon={alertType === 'success' ? <CheckCircleIcon fontSize="inherit" /> : <WarningAmberIcon fontSize="inherit" />}
                    variant="filled"
                    sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 1.5,
                        boxShadow: 2,
                        width: '420px',
                        backgroundColor: alertType === 'success' ? '#22c55e' : '#facc15',
                        color: alertType === 'success' ? '#064e3b' : '#78350f',
                        '& .MuiAlert-icon': { mr: 1 },
                        '& .MuiAlert-message': { fontSize: '0.95rem', fontWeight: 500 },
                    }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Box
                onClick={openForm}
                sx={{
                    margin: '0 auto',
                    display: 'flex', alignItems: 'center',flexDirection: 'column',
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    color: '#6b7280',
                    backgroundColor: '#ffffff',
                    '&:hover': { backgroundColor: '#f9fafb' },
                    width: '600px'
                }}
            >
                Bạn viết gì đi
            </Box>

            {/* Create Post Modal */}
            <Dialog open={openCreate} onClose={closeForm} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Typography variant="h6" fontWeight={700}>Tạo bài viết</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Nội dung"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            multiline
                            minRows={3}
                            fullWidth
                        />
                        {attachments.map((url, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    label={`File URL ${idx + 1}`}
                                    name={`file_url_${idx}`}
                                    value={url}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setAttachments(prev => prev.map((u, i) => i === idx ? val : u));
                                    }}
                                    fullWidth
                                    placeholder="https://..."
                                />
                                {attachments.length > 1 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeAttachmentField(idx)}
                                        sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}
                                    >
                                        Xóa
                                    </Button>
                                )}
                            </Box>
                        ))}
                        <Button variant="text" onClick={addAttachmentField} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                            + Thêm file URL
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeForm} variant="contained" sx={{ bgcolor: '#9ca3af', '&:hover': { bgcolor: '#6b7280' }, textTransform: 'none' }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, textTransform: 'none' }}>
                        Đăng bài
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Posts list (memoized) */}
            <PostsList
                items={posts}
                onToggleLike={handleToggleLike}
                onOpenComments={openCommentsFor}
                formatRelative={formatRelative}
                currentUserId={currentUserId}
                onRequestDelete={requestDeletePost}
            />

            {/* Focused post with comments (memoized) */}
            <CommentsDialog
                open={openComments}
                post={selectedPost}
                onClose={closeComments}
                onTogglePostLike={handleToggleLike}
                onToggleCommentLike={handleToggleCommentLike}
                onApplyNewComment={applyNewCommentToState}
                onSuccess={onSuccess}
                onNotify={(type, msg) => { setAlertType(type); setAlertMessage(msg); setShowAlert(true); }}
                currentUserId={currentUserId}
                onApplyDeleteComment={(postId, commentId) => {
                    // update selectedPost
                    setSelectedPost(prev => {
                        if (!prev || prev.id !== postId) return prev;
                        return {
                            ...prev,
                            comments: (prev.comments || []).filter(c => c.id !== commentId),
                            _count: { ...prev._count, comments: Math.max(0, (prev._count?.comments || 0) - 1) }
                        };
                    });
                    // update list
                    setData(prev => {
                        if (!prev?.items) return prev;
                        return {
                            ...prev,
                            items: prev.items.map(p => p.id !== postId ? p : ({
                                ...p,
                                comments: (p.comments || []).filter(c => c.id !== commentId),
                                _count: { ...p._count, comments: Math.max(0, (p._count?.comments || 0) - 1) }
                            }))
                        };
                    });
                }}
                formatRelative={formatRelative}
            />

            {/* Confirm delete dialog */}
            <Dialog open={deleteOpen} onClose={closeDeleteConfirm}>
                <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
                <DialogContent>
                    Bạn có chắc chắn muốn xóa bài viết này? Hành động không thể hoàn tác.
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteConfirm} variant="contained" sx={{ bgcolor: '#9ca3af', '&:hover': { bgcolor: '#6b7280' }, textTransform: 'none' }}>
                        Hủy
                    </Button>
                    <Button onClick={confirmDeletePost} variant="contained" sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, textTransform: 'none' }}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// Memoized list of posts to avoid re-rendering while typing in other inputs
const PostsList = React.memo(function PostsList({ items, onToggleLike, onOpenComments, formatRelative, currentUserId, onRequestDelete }) {
    return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            {items?.map((post) => (
                <Box key={post.id} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, background: '#fff', p: 2, width: '100%', maxWidth: 600 }}>
                    {/* Header: avatar + name + time + (optional delete) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Avatar
                                src={post.author?.avatar_url || ''}
                                alt={post.author?.full_name || 'User'}
                                sx={{ width: 36, height: 36 }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                                    {post.author?.full_name || 'Người dùng'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {formatRelative(post.created_at)}
                                </Typography>
                            </Box>
                        </Box>
                        {post.author?.id === currentUserId && (
                            <Tooltip title="Xóa bài">
                                <IconButton size="small" onClick={() => onRequestDelete(post.id)}>
                                    <DeleteOutlineIcon sx={{ color: '#6b7280' }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    {post.content && (
                        <Typography sx={{ mt: 1.25, color: '#111827' }}>{post.content}</Typography>
                    )}
                    {/* Image placeholder */}
                    <Box
                        component="img"
                        src="https://userpic.codeforces.org/747128/title/188117d8deb6f127.jpg"
                        alt="post"
                        sx={{ width: '100%', mt: 1.25, borderRadius: 1.5, objectFit: 'cover' }}
                    />
                    {/* Stats: left likes, right comments */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {post._count?.likes || 0} lượt thích
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {post._count?.comments || 0} bình luận
                        </Typography>
                    </Box>
                    {/* Actions: like left, comment right */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, px: 8 }}>
                        <Button
                            variant="text"
                            startIcon={post.liked ? <ThumbUpAltIcon sx={{ color: '#2563eb' }} /> : <ThumbUpOffAltIcon sx={{ color: '#374151' }} />}
                            onClick={() => onToggleLike(post.id)}
                            sx={{ textTransform: 'none', color: '#374151' }}
                        >
                            Thích
                        </Button>
                        <Button
                            variant="text"
                            startIcon={<ChatBubbleOutlineIcon />}
                            sx={{ textTransform: 'none', color: '#374151' }}
                            onClick={() => onOpenComments(post)}
                        >
                            Bình luận
                        </Button>
                    </Box>
                </Box>
            ))}
        </Box>
    );
});

// Memoized dialog for comments with internal state and memoized computations
const CommentsDialog = React.memo(function CommentsDialog({ open, post, onClose, onTogglePostLike, onToggleCommentLike, onApplyNewComment, onSuccess, formatRelative, currentUserId, onNotify, onApplyDeleteComment }) {
    const [commentsToShow, setCommentsToShow] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [deleteCommentOpen, setDeleteCommentOpen] = useState(false);

    // Reset internal state when post changes or dialog opens
    useEffect(() => {
        if (open) {
            setCommentsToShow(5);
            setNewComment('');
        }
    }, [open, post?.id]);

    const visibleComments = useMemo(() => {
        const comments = post?.comments || [];
        const sorted = [...comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return sorted.slice(0, commentsToShow);
    }, [post?.comments, commentsToShow]);

    const handleAddComment = useCallback(async () => {
        const c = newComment.trim();
        if (!c || !post) return;
        try {
            setCommentLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/channels/posts/${post.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content: c, attachments: [] })
            });
            if (!res.ok) return;
            const cmt = await res.json();
            onApplyNewComment(post.id, cmt);
            setNewComment('');
            setCommentsToShow(v => v + 1);
            onSuccess('Bình luận thành công');
        } finally {
            setCommentLoading(false);
        }
    }, [newComment, onApplyNewComment, onSuccess, post]);

    const requestDeleteComment = useCallback((commentId) => {
        setDeleteCommentId(commentId);
        setDeleteCommentOpen(true);
    }, []);

    const closeDeleteComment = useCallback(() => {
        setDeleteCommentOpen(false);
        setDeleteCommentId(null);
    }, []);

    const confirmDeleteComment = useCallback(async () => {
        if (!deleteCommentId || !post) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/channels/comments/${deleteCommentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error('Xóa bình luận thất bại');
            onApplyDeleteComment(post.id, deleteCommentId);
            onNotify('success', 'Đã xóa bình luận');
        } catch (e) {
            onNotify('warning', e?.message || 'Xóa bình luận thất bại');
        } finally {
            closeDeleteComment();
        }
    }, [deleteCommentId, post, onApplyDeleteComment, onNotify, closeDeleteComment]);

    if (!post) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Avatar src={post.author?.avatar_url || ''} sx={{ width: 36, height: 36 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                            {post.author?.full_name || 'Người dùng'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {formatRelative(post.created_at)}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {post.content && (
                    <Typography sx={{ mb: 1.25, color: '#111827' }}>{post.content}</Typography>
                )}
                <Box
                    component="img"
                    src="https://userpic.codeforces.org/747128/title/188117d8deb6f127.jpg"
                    alt="post"
                    sx={{ width: '100%', mb: 1.25, borderRadius: 1.5, objectFit: 'cover' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {post._count?.likes || 0} lượt thích
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {post._count?.comments || 0} bình luận
                    </Typography>
                </Box>
                {/* Focused actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 8 }}>
                    <Button
                        variant="text"
                        startIcon={post.liked ? <ThumbUpAltIcon sx={{ color: '#2563eb' }} /> : <ThumbUpOffAltIcon sx={{ color: '#374151' }} />}
                        onClick={() => onTogglePostLike(post.id)}
                        sx={{ textTransform: 'none', color: '#374151' }}
                    >
                        Thích
                    </Button>
                    <Button
                        variant="text"
                        startIcon={<ChatBubbleOutlineIcon />}
                        sx={{ textTransform: 'none', color: '#374151' }}
                    >
                        Bình luận
                    </Button>
                </Box>
                <Divider sx={{ mb: 1.25 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    {visibleComments.map((c) => (
                        <Box key={c.id}>
                            {/* Row: avatar + bubble */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Avatar src={c.author?.avatar_url || ''} sx={{ width: 28, height: 28, mt: 0.25 }} />
                                <Box sx={{ background: '#f3f4f6', borderRadius: 2, px: 1, py: 0.75, flex: 1, position: 'relative' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#111827' }} variant="body2">
                                            {c.author?.full_name || 'Người dùng'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                            {formatRelative(c.created_at)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: '#111827' }}>{c.content}</Typography>
                                    {c.author?.id === currentUserId && (
                                        <IconButton
                                            size="small"
                                            onClick={() => requestDeleteComment(c.id)}
                                            sx={{ position: 'absolute', top: 4, right: 4 }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" sx={{ color: '#6b7280' }} />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                            {/* Row: actions below bubble (not wrapped inside) */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, ml: 4.5 }}>
                                <Button
                                    size="small"
                                    variant="text"
                                    startIcon={(c.liked || (c.likes && c.likes.length > 0))
                                        ? <ThumbUpAltIcon fontSize="small" sx={{ color: '#2563eb' }} />
                                        : <ThumbUpOffAltIcon fontSize="small" sx={{ color: '#374151' }} />}
                                    onClick={() => onToggleCommentLike(c.id)}
                                    sx={{ textTransform: 'none', color: '#374151' }}
                                >
                                    Thích
                                </Button>
                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {(c._count?.likes || 0)} lượt thích
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                    {(post.comments?.length || 0) > commentsToShow && (
                        <Button variant="text" sx={{ alignSelf: 'center', textTransform: 'none' }} onClick={() => setCommentsToShow(v => v + 5)}>
                            Xem thêm bình luận
                        </Button>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <TextField
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        fullWidth
                        size="small"
                    />
                    <Button onClick={handleAddComment} disabled={commentLoading || !newComment.trim()} variant="contained" sx={{ textTransform: 'none' }}>
                        Gửi
                    </Button>
                </Box>
            </DialogActions>
            {/* Delete comment confirm dialog */}
            <Dialog open={deleteCommentOpen} onClose={closeDeleteComment} maxWidth="xs" fullWidth>
                <DialogTitle>Xác nhận xóa bình luận</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xóa bình luận này? Hành động không thể hoàn tác.</DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteComment} variant="contained" sx={{ bgcolor: '#9ca3af', '&:hover': { bgcolor: '#6b7280' }, textTransform: 'none' }}>Hủy</Button>
                    <Button onClick={confirmDeleteComment} variant="contained" sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, textTransform: 'none' }}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
});
export default ShowChannel;