import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Chip, Button, CircularProgress, List, ListItem, ListItemText, Snackbar, Alert, Fade, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

function approvalChip(status) {
  const s = (status || '').toLowerCase();
  if (s === 'active') {
    return { text: 'Đã duyệt', color: 'success', variant: 'filled', icon: <CheckCircleIcon fontSize="small" /> };
  }
  if (s === 'rejected') {
    return { text: 'Bị từ chối', color: 'error', variant: 'filled', icon: <CancelIcon fontSize="small" /> };
  }
  return { text: 'Đang chờ duyệt', color: 'warning', variant: 'filled', icon: <HourglassBottomIcon fontSize="small" /> };
}

const ManagePendingCampaign = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const pageSize = 3;
  const navigate = useNavigate();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categories, setCategories] = useState([]);

  // Role guard: only allow ADMIN to access
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) { navigate('/login', { replace: true }); return; }
      const user = JSON.parse(userStr);
      const roles =  String(user.roles[0].role.name);
      const isAdmin = roles.includes('ADMIN');
      if (!isAdmin) { navigate('/', { replace: true }); }
    } catch {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 30);
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login', { replace: true }); return () => clearTimeout(t); }
    setLoading(true);
    fetch('http://localhost:4000/events/', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(res => { if (!res.ok) throw new Error('Không lấy được danh sách sự kiện'); return res.json(); })
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const pending = arr.filter(ev => String(ev.status || ev.approval_status || '').toLowerCase() === 'pending');
        setEvents(pending);
        setError('');
      })
      .catch(err => setError(err.message || String(err)))
      .finally(() => setLoading(false));
    return () => clearTimeout(t);
  }, [navigate]);

  // Load categories for display of current category name
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:4000/categories', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  const refresh = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:4000/events/', { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (!res.ok) return;
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      const pending = arr.filter(ev => String(ev.status || ev.approval_status || '').toLowerCase() === 'pending');
      setEvents(pending);
    } catch {}
  };

  const approveEvent = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:4000/admin/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approved' })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Duyệt sự kiện thất bại');
      }
      setSnackbarMsg('Đã duyệt sự kiện');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await refresh();
    } catch (e) {
      setSnackbarMsg(e.message || 'Có lỗi khi duyệt');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
  };

  const rejectEvent = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:4000/admin/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rejected' })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Từ chối sự kiện thất bại');
      }
      setSnackbarMsg('Đã từ chối sự kiện');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await refresh();
    } catch (e) {
      setSnackbarMsg(e.message || 'Có lỗi khi từ chối');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
  };

  const openDetail = (ev) => {
    setSelectedEvent(ev);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Box className={`campaign-join-page`} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 66px)' }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={(_, reason) => { if (reason === 'clickaway') return; setSnackbarOpen(false); }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Fade}
        transitionDuration={{ enter: 250, exit: 200 }}
        sx={{ top: 4 }}
      >
        <Alert severity={snackbarSeverity} variant="filled" sx={{ px: 2, py: 1, borderRadius: 1.5, boxShadow: 2 }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
      <Paper sx={{ p: 0, borderRadius: 2, maxWidth: 1200, width: '100%', mx: 'auto' }} className={`bvf-animate ${mounted ? 'in-view' : ''}`}>
        <Typography
          variant="h4"
          sx={{
            backgroundColor: '#16a34a',
            color: '#ffffff',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            m: 0
          }}
        >
          Duyệt sự kiện đang chờ
        </Typography>
        {/* Right-aligned total count */}
        <Box sx={{ px: { xs: 1.5, sm: 2 }, mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography sx={{ fontWeight: 600 }}>
            Tổng: {events.length} chiến dịch chờ duyệt
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 1.5, sm: 2 }, mt: 0 }}>
          {loading ? (
            <Box sx={{ py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={22} />
              <Typography>Đang tải...</Typography>
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : events.length === 0 ? (
            <Typography>Không có sự kiện đang chờ duyệt.</Typography>
          ) : (
            <List>
              {events.slice(page * pageSize, page * pageSize + pageSize).map((ev) => {
                const rawStatus = ev.approval_status || ev.status;
                const st = approvalChip(rawStatus);
                const title = ev.title || ev.name || `Sự kiện #${ev.id}`;
                const locationName = ev.location?.name || '';
                return (
                  <React.Fragment key={ev.id}>
                    <ListItem
                      className={`scj-item scj-${(rawStatus || '').toLowerCase()}`}
                      sx={{ position: 'relative' }}
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" onClick={() => openDetail(ev)} sx={{ bgcolor: '#16a34a', textTransform: 'none', fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: '#14532d', boxShadow: 'none' } }} startIcon={<VisibilityIcon />}>
                            Xem
                          </Button>
                          <Button size="small" variant="outlined" color="success" onClick={() => approveEvent(ev.id)} startIcon={<DoneAllIcon />} sx={{ textTransform: 'none', fontWeight: 600  }}>
                            Chấp nhận
                          </Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => rejectEvent(ev.id)} startIcon={<CloseIcon />} sx={{ textTransform: 'none', fontWeight: 600 }}>
                            Từ chối
                          </Button>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                            {ev.banner_url ? (
                              <Box component="img" src={ev.banner_url} alt={title} sx={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                            ) : (
                              <Box sx={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontWeight: 700, border: '1px solid #e2e8f0' }} aria-label="no-thumbnail">
                                {String(title).trim().charAt(0).toUpperCase()}
                              </Box>
                            )}
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{title}</Typography>
                            <Chip size="small" label={st.text} color={st.color} variant={st.variant} icon={st.icon} sx={{ fontWeight: 500 }} />
                          </Box>
                        }
                        secondary={
                          locationName ? (
                            <Typography sx={{ color: '#475569', mt: 0.25, fontSize: '.84rem' }}>
                              Địa điểm: <strong>{locationName}</strong>
                            </Typography>
                          ) : undefined
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, py: 1.5 }}>
          <IconButton size="small" onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0} aria-label="Trang trước">
            <KeyboardArrowLeftIcon />
          </IconButton>
          <Box sx={{ px: 1, py: 0.5, borderRadius: 1}}>
            <Typography sx={{ fontSize: { xs: '.85rem', sm: '.9rem' } }}>
              Trang {page + 1} / {Math.max(1, Math.ceil(events.length / pageSize))}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setPage(p => (p + 1 < Math.ceil(events.length / pageSize) ? p + 1 : p))} disabled={page + 1 >= Math.ceil(events.length / pageSize)} aria-label="Trang sau">
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      </Paper>
      {/* Read-only detail dialog for ADMIN review */}
      <Dialog open={detailOpen} onClose={closeDetail} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: '#0ea5e9', color: '#fff', px: 2, pt: 2.5, pb: 2 }}>Chi tiết sự kiện</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedEvent ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <TextField
                label="Tiêu đề"
                value={selectedEvent.title || ''}
                InputLabelProps={{ shrink: true }}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{
                  '& .MuiInputBase-root': { opacity: 1 },
                  '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' },
                  '& .MuiInputLabel-root': { color: '#1f2937' },
                  mt:2
                }}
                
              />
              <FormControl fullWidth disabled sx={{
                '&.Mui-disabled': { opacity: 1 },
                '& .MuiInputLabel-root.Mui-disabled': { color: '#1f2937' },
                '& .MuiOutlinedInput-root.Mui-disabled': { opacity: 1 },
                '& .MuiOutlinedInput-input.Mui-disabled': { WebkitTextFillColor: '#111827' }
              }}>
                <InputLabel id="detail-category-select-label" sx={{ mt: 2 }}>Thể loại</InputLabel>
                {(() => {
                  const currentCategoryId = selectedEvent.category_id ?? selectedEvent.category?.id ?? '';
                  const currentCategoryName = selectedEvent.category?.name ?? (categories.find(c => String(c.id) === String(currentCategoryId))?.name) ?? '';
                  return (
                    <Select
                      labelId="detail-category-select-label"
                      label="Thể loại"
                      sx={{ mt: 2 }}
                      value={currentCategoryId}
                      renderValue={(value) => currentCategoryName || '—'}
                    >
                      {categories.length > 0 ? (
                        categories.map((c) => (
                          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        ))
                      ) : (
                        currentCategoryId ? <MenuItem value={currentCategoryId}>{currentCategoryName || '—'}</MenuItem> : null
                      )}
                    </Select>
                  );
                })()}
              </FormControl>

              <TextField label="Bắt đầu" value={selectedEvent.start_time ? new Date(selectedEvent.start_time).toLocaleString('vi-VN') : ''} InputLabelProps={{ shrink: true }} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { opacity: 1 }, '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' }, '& .MuiInputLabel-root': { color: '#1f2937' } }} />
              <TextField label="Kết thúc" value={selectedEvent.end_time ? new Date(selectedEvent.end_time).toLocaleString('vi-VN') : ''} InputLabelProps={{ shrink: true }} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { opacity: 1 }, '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' }, '& .MuiInputLabel-root': { color: '#1f2937' } }} />

              <TextField label="Số lượng" value={selectedEvent.capacity ?? ''} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { opacity: 1 }, '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' }, '& .MuiInputLabel-root': { color: '#1f2937' } }} />

              <TextField label="Địa điểm - Tên" value={selectedEvent.location?.name || ''} InputLabelProps={{ shrink: true }} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { opacity: 1 }, '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' }, '& .MuiInputLabel-root': { color: '#1f2937' } }} />
              <TextField label="Địa điểm - Số đường" value={selectedEvent.location?.address_line || ''} InputLabelProps={{ shrink: true }} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { opacity: 1 }, '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' }, '& .MuiInputLabel-root': { color: '#1f2937' } }} />
              <TextField label="Quận/Huyện" value={selectedEvent.location?.district || ''} InputLabelProps={{ shrink: true }} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { opacity: 1 }, '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' }, '& .MuiInputLabel-root': { color: '#1f2937' } }} />
              <TextField label="Tỉnh/Thành phố" value={selectedEvent.location?.province || ''} InputLabelProps={{ shrink: true }} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { opacity: 1 }, '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' }, '& .MuiInputLabel-root': { color: '#1f2937' } }} />
              <TextField label="Quốc gia" value={selectedEvent.location?.country || ''} InputLabelProps={{ shrink: true }} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { opacity: 1 }, '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' }, '& .MuiInputLabel-root': { color: '#1f2937' } }} />

              <TextField label="Mô tả" value={selectedEvent.description || ''} multiline minRows={3} sx={{ gridColumn: { sm: '1 / -1' }, '& .MuiInputBase-root': { opacity: 1 }, '& .MuiInputBase-input': { WebkitTextFillColor: '#111827' }, '& .MuiInputLabel-root': { color: '#1f2937' } }} fullWidth InputProps={{ readOnly: true }} />

              <Box sx={{ gridColumn: { sm: '1 / -1' }, mt: 1 }}>
                {selectedEvent.banner_url ? (
                  <Box component="img" src={selectedEvent.banner_url} alt="banner" sx={{ maxWidth: '100%', height: 'auto', borderRadius: 1.5, border: '1px solid #e5e7eb' }} />
                ) : null}
              </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetail}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagePendingCampaign;