import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Chip, Button, CircularProgress, List, ListItem, ListItemText, Snackbar, Alert, Fade, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
  if (s === 'approved') {
    return { text: 'Đã chấp nhận', color: 'success', variant: 'filled', icon: <CheckCircleIcon fontSize="small" /> };
  }
  if (s === 'rejected') {
    return { text: 'Đã từ chối', color: 'error', variant: 'filled', icon: <CancelIcon fontSize="small" /> };
  }
  return { text: 'Đang chờ duyệt', color: 'warning', variant: 'filled', icon: <HourglassBottomIcon fontSize="small" /> };
}

const ManagePendingRegistration = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regs, setRegs] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const navigate = useNavigate();

  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [campaignFilter, setCampaignFilter] = useState('all'); // 'all' | 'mine' | eventId
  const [currentUserId, setCurrentUserId] = useState(null);
  const [myCampaigns, setMyCampaigns] = useState([]);

  // Role guard: only allow EVENT_MANAGER to access
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) { navigate('/login', { replace: true }); return; }
      const user = JSON.parse(userStr);
      const roleName = String(user.roles?.[0]?.role?.name || '');
      setCurrentUserId(user?.id ?? user?.user_id ?? null);
      if (roleName !== 'EVENT_MANAGER') { navigate('/', { replace: true }); }
    } catch {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Fetch all my campaigns so the filter can list campaigns even with no registrations
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return;
    let uid = null;
    try { const u = JSON.parse(userStr); uid = u?.id ?? u?.user_id ?? null; } catch {}
    fetch('http://localhost:4000/events/', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const mine = arr.filter((ev) => {
          const managerId = ev?.manager?.id ?? ev?.manager_id ?? null;
          const creatorId = ev?.creator_id ?? ev?.created_by ?? ev?.user_id ?? null;
          const status = ev?.status;
          return (uid && status === "active" && (String(managerId) === String(uid) || String(creatorId) === String(uid)));
        });
        setMyCampaigns(mine);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 30);
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login', { replace: true }); return () => clearTimeout(t); }
    setLoading(true);
    // Backend should return pending registrations for events managed by current EVENT_MANAGER
    fetch('http://localhost:4000/registrations/pending', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(res => { if (!res.ok) throw new Error('Không lấy được danh sách đơn đăng ký'); return res.json(); })
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        // normalize shape: expect each item contains { id, status, event, user }
        setRegs(arr);
        setError('');
      })
      .catch(err => setError(err.message || String(err)))
      .finally(() => setLoading(false));
    return () => clearTimeout(t);
  }, [navigate]);

  const refresh = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:4000/registrations/pending', { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (!res.ok) return;
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setRegs(arr);
    } catch (e) {
      // ignore refresh errors silently to keep UI responsive
      console.warn('refresh registrations failed', e);
    }
  };

  // Build campaign list from registrations
  const campaigns = React.useMemo(() => {
    const map = new Map();
    (regs || []).forEach(r => {
      const ev = r.event || {};
      const id = ev.id ?? r.event_id;
      const title = ev.title || ev.name || (id != null ? `Sự kiện #${id}` : '—');
      if (id != null && !map.has(id)) {
        map.set(id, { id, title, created_at: ev.created_at || null, start_time: ev.start_time || null });
      }
    });
    return Array.from(map.values());
  }, [regs]);

  // Event IDs created by current user
  const myCampaignIds = React.useMemo(() => {
    if (!currentUserId) return new Set();
    const ids = new Set();
    (regs || []).forEach(r => {
      const ev = r.event || {};
      const creator = ev.created_by ?? ev.creator_id ?? ev.owner_id ?? ev.organizer_id ?? ev.manager_id ?? null;
      const id = ev.id ?? r.event_id;
      if (id != null && creator != null && String(creator) === String(currentUserId)) {
        ids.add(String(id));
      }
    });
    return ids;
  }, [regs, currentUserId]);

  const filteredRegs = React.useMemo(() => {
    if (campaignFilter === 'all') return regs;
    if (campaignFilter === 'mine') {
      if (!myCampaignIds.size) return [];
      return (regs || []).filter(r => {
        const ev = r.event || {};
        const id = ev.id ?? r.event_id;
        return myCampaignIds.has(String(id));
      });
    }
    const targetId = campaignFilter;
    if (targetId == null) return regs;
    return (regs || []).filter(r => {
      const ev = r.event || {};
      const id = ev.id ?? r.event_id;
      return String(id) === String(targetId);
    });
  }, [regs, campaignFilter, myCampaignIds]);

  const approveReg = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:4000/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Chấp nhận đơn đăng ký thất bại');
      }
      setSnackbarMsg('Đã chấp nhận đơn đăng ký');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await refresh();
    } catch (e) {
      setSnackbarMsg(e.message || 'Có lỗi khi chấp nhận');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
  };

  const rejectReg = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:4000/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Từ chối đơn đăng ký thất bại');
      }
      setSnackbarMsg('Đã từ chối đơn đăng ký');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await refresh();
    } catch (e) {
      setSnackbarMsg(e.message || 'Có lỗi khi từ chối');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
  };

  const openEventDetail = (ev) => { setSelectedEvent(ev); setEventDetailOpen(true); };
  const closeEventDetail = () => { setEventDetailOpen(false); setSelectedEvent(null); };
  const openUserDetail = (u) => { setSelectedUser(u); setUserDetailOpen(true); };
  const closeUserDetail = () => { setUserDetailOpen(false); setSelectedUser(null); };

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
          Duyệt đơn đăng ký tham gia
        </Typography>
        <Box sx={{ p: { xs: 1.5, sm: 2 }, mt: 4 }}>
          {/* Filter + total count */}
          <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: { xs: 220, sm: 260 } }}>
              <InputLabel id="campaign-filter-label">Lọc theo chiến dịch </InputLabel>
              <Select
                labelId="campaign-filter-label"
                id="campaign-filter"
                label="Lọc theo chiến dịch"
                value={campaignFilter}
                onChange={(e) => { setCampaignFilter(e.target.value); setPage(0); }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {myCampaigns.map(ev => (
                  <MenuItem key={ev.id} value={ev.id}>{ev.title || ev.name || `Sự kiện #${ev.id}`}</MenuItem>
                ))}
                {campaigns
                  .filter(c => !myCampaigns.some(ev => String(ev.id) === String(c.id)))
                  .map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Typography sx={{ fontSize: { xs: '.9rem', sm: '1rem' }, color: '#334155' }}>
              Tổng: <strong>{filteredRegs.length}</strong> đơn
            </Typography>
          </Box>
          {loading ? (
            <Box sx={{ py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={22} />
              <Typography>Đang tải...</Typography>
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredRegs.length === 0 ? (
            <Typography>Không có đơn đăng ký đang chờ duyệt.</Typography>
          ) : (
            <List>
              {filteredRegs.slice(page * pageSize, page * pageSize + pageSize).map((r) => {
                const st = approvalChip(r.status);
                
                const volunteerName = r.user?.username;
                const eventTitle = r.event?.title || r.event?.name || `Sự kiện #${r.event_id}`;
                return (
                  <React.Fragment key={r.id}>
                    <ListItem
                      className={`scj-item scj-${(r.status || '').toLowerCase()}`}
                      sx={{ py: { xs: 1.25, sm: 1.5 } }}
                    >
                      <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: { xs: 1, sm: 2 }
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{volunteerName}</Typography>
                            <Typography sx={{ color: '#475569' }}>→</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{eventTitle}</Typography>
                            <Chip size="small" label={st.text} color={st.color} variant={st.variant} icon={st.icon} sx={{ fontWeight: 500 }} />
                          </Box>
                          <Typography sx={{ color: '#475569', mt: 0.25, fontSize: '.84rem' }}>
                            Đăng ký lúc: <strong>{r.created_at ? new Date(r.created_at).toLocaleString('vi-VN') : '—'}</strong>
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr 1fr', sm: 'auto auto' },
                          columnGap: 0.75,
                          rowGap: 0.75,
                          alignItems: 'center',
                          justifyContent: { xs: 'stretch', sm: 'flex-end' },
                          minWidth: { sm: 340 }
                        }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => openEventDetail(r.event)}
                            startIcon={<VisibilityIcon />}
                            sx={{
                              bgcolor: '#16a34a',
                              textTransform: 'none',
                              fontWeight: 700,
                              boxShadow: 'none',
                              '&:hover': { bgcolor: '#14532d', boxShadow: 'none' },
                              minWidth: { xs: '100%', sm: 160 }
                            }}
                          >
                            Chi tiết sự kiện
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => approveReg(r.id)}
                            startIcon={<DoneAllIcon />}
                            sx={{ textTransform: 'none', fontWeight: 600, minWidth: { xs: '100%', sm: 120 } }}
                          >
                            Chấp nhận
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => openUserDetail(r.user)}
                            startIcon={<VisibilityIcon />}
                            sx={{ textTransform: 'none', fontWeight: 600, minWidth: { xs: '100%', sm: 180 } }}
                          >
                            Chi tiết tình nguyện viên
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => rejectReg(r.id)}
                            startIcon={<CloseIcon />}
                            sx={{ textTransform: 'none', fontWeight: 600, minWidth: { xs: '100%', sm: 120 } }}
                          >
                            Từ chối
                          </Button>
                        </Box>
                      </Box>
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
              Trang {page + 1} / {Math.max(1, Math.ceil(filteredRegs.length / pageSize))}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setPage(p => (p + 1 < Math.ceil(filteredRegs.length / pageSize) ? p + 1 : p))} disabled={page + 1 >= Math.ceil(filteredRegs.length / pageSize)} aria-label="Trang sau">
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Event detail dialog (read-only, same style as ManagePendingCampaign) */}
      <Dialog open={eventDetailOpen} onClose={closeEventDetail} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: '#2563eb', color: '#fff', px: 2, pt: 2.5, pb: 2 , fontWeight: 700}}>Chi tiết sự kiện</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedEvent ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mt: 1, color: '#1f2937' }}>
                Tiêu đề: <strong>{selectedEvent.title || selectedEvent.name || '—'}</strong>
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, color: '#1f2937' }}>
                Thể loại: <strong>{selectedEvent.category?.name || selectedEvent.category_name || (selectedEvent.category_id ? `#${selectedEvent.category_id}` : '—')}</strong>
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, color: '#1f2937' }}>
                Bắt đầu: <strong>{selectedEvent.start_time ? new Date(selectedEvent.start_time).toLocaleString('vi-VN') : '—'}</strong>
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, color: '#1f2937' }}>
                Kết thúc: <strong>{selectedEvent.end_time ? new Date(selectedEvent.end_time).toLocaleString('vi-VN') : '—'}</strong>
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, color: '#1f2937' }}>
                Số lượng: <strong>{selectedEvent.total_joined+selectedEvent.capacity ?? '—'}</strong>
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, color: '#1f2937', gridColumn: { sm: '1 / -1' } }}>
                {(() => {
                  const loc = selectedEvent.location || null;
                  const name = loc?.name || selectedEvent.location_name || '';
                  const address = loc?.address_line || '';
                  const district = loc?.district || '';
                  const province = loc?.province || '';
                  const country = loc?.country || '';
                  const parts = [name, address, district, province, country].filter(p => !!String(p).trim());
                  const combined = parts.length ? parts.join(', ') : '—';
                  return (
                    <>Địa điểm: <strong>{combined}</strong></>
                  );
                })()}
              </Typography>
              <Typography variant="subtitle2" sx={{ gridColumn: { sm: '1 / -1' }, mt: 1, color: '#1f2937' }}>
                Mô tả: <span style={{ fontWeight: 600, color: '#111827' }}>{selectedEvent.description || '—'}</span>
              </Typography>
              <Box sx={{ gridColumn: { sm: '1 / -1' }, mt: 1 }}>
                {selectedEvent.banner_url ? (
                  <Box component="img" src={selectedEvent.banner_url} alt="banner" sx={{ maxWidth: '100%', height: 'auto', borderRadius: 1.5, border: '1px solid #e5e7eb' }} />
                ) : null}
              </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEventDetail} variant='contained'>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Volunteer detail dialog (mirrors ControlUser detail) */}
      <Dialog open={userDetailOpen} onClose={closeUserDetail}>
        <DialogTitle sx={{ bgcolor: '#2563eb', color: '#ffffff', fontWeight: 700, py: 3 }}>
          Thông tin tình nguyện viên
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser ? (
            <Box sx={{ minWidth: 320, pt: 0.5 }}>
              <Typography><strong>Họ tên:</strong> {selectedUser.full_name || '—'}</Typography>
              <Typography><strong>Tên đăng nhập:</strong> {selectedUser.username || '—'}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email || '—'}</Typography>
              <Typography><strong>Số điện thoại:</strong> {selectedUser.phone || '—'}</Typography>
              {selectedUser.created_at ? (
                <Typography><strong>Tạo lúc:</strong> {new Date(selectedUser.created_at).toLocaleString('vi-VN')}</Typography>
              ) : null}
              <Box sx={{ gridColumn: { sm: '1 / -1' }, mt: 1 }}>
                {selectedUser.avatar_url ? (
                  <Box component="img" src={selectedUser.avatar_url} alt="avatar" sx={{ maxWidth: '100%', height: 'auto', borderRadius: 1.5, border: '1px solid #e5e7eb' }} />
                ) : null}
              </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUserDetail} variant="contained" sx={{ textTransform: 'none' }}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagePendingRegistration;
