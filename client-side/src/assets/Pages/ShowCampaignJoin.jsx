import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Chip, Button, CircularProgress, List, ListItem, ListItemText, Snackbar, Alert, Fade, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate, useLocation } from 'react-router-dom';
import './ShowCampaignJoin.css';

function statusLabel(status) {
  switch (status) {
    case 'approved':
      return { text: 'Đã tham gia', color: 'success', variant: 'filled', icon: <CheckCircleIcon fontSize="small" /> };
    case 'pending':
      return { text: 'Đang chờ duyệt', color: 'warning', variant: 'filled' };
    case 'rejected':
      return { text: 'Bị từ chối', color: 'error', variant: 'filled' };
    case 'completed':
      return { text: 'Hoàn thành', color: 'success', variant: 'contained', icon: <DoneAllIcon fontSize="small" /> };
    case 'Absent':
      return { text: 'Vắng mặt', color: 'error', variant: 'outlined' };
    default:
      return { text: status || 'Không xác định', color: 'default', variant: 'outlined' };
  }
}

const ShowCampaignJoin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('warning');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const fmtStartTime = (d) => {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    const weekday = dt.toLocaleDateString('vi-VN', { weekday: 'long' });
    const hour = dt.getHours();
    const dateStr = dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${weekday}, ${hour} giờ, ${dateStr}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      navigate('/login', { replace: true });
      return;
    }
    // Role guard: only VOLUNTEER can access this page
    try {
      const user = JSON.parse(userStr);
      const roles = String(user?.roles?.[0]?.role?.name || '');
      const isVolunteer = roles.includes('VOLUNTEER');
      if (!isVolunteer) { navigate('/', { replace: true }); return; }
    } catch {
      navigate('/', { replace: true });
      return;
    }
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 30);
    setLoading(true);
    fetch('http://localhost:4000/registrations/my', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Không lấy được danh sách tham gia');
        return res.json();
      })
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const filtered = arr.filter(r => String(r.status || '').toLowerCase() !== 'cancelled');
        setRegistrations(filtered);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
    return () => clearTimeout(t);
  }, [navigate, location.key]);

  // Derived list by status filter
  const normalized = (s) => String(s || '').toLowerCase();
  const statusFilterLabel = (val) => {
    switch (val) {
      case 'pending': return 'Đang chờ duyệt';
      case 'approved': return 'Đã tham gia';
      case 'rejected': return 'Bị từ chối';
      case 'completed': return 'Hoàn thành';
      case 'absent': return 'Vắng mặt';
      default: return 'Tất cả';
    }
  };
  const filteredRegs = registrations.filter((r) => {
    if (!statusFilter) return true;
    const st = normalized(r.status);
    switch (statusFilter) {
      case 'pending': return st === 'pending';
      case 'approved': return st === 'approved';
      case 'rejected': return st === 'rejected';
      case 'completed': return st === 'completed';
      case 'absent': return st === 'absent' || st === 'absent';
      default: return true;
    }
  });

  // Reset page when filter changes
  useEffect(() => { setPage(0); }, [statusFilter]);

  const cancelRegistration = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token || !eventId) return;
    try {
      setCanceling(true);
      const cancelReq = fetch(`http://localhost:4000/registrations/${eventId}/register`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const delay = new Promise((resolve) => setTimeout(resolve, 2000));
      const [res] = await Promise.all([cancelReq, delay]);
      if (!res.ok) {
        let msg = 'Hủy thất bại';
        try {
          const errBody = await res.json();
          msg = errBody?.error || msg;
        } catch {}
        setSnackbarMsg(msg);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      // Refresh registrations list and exclude cancelled
      const resList = await fetch('http://localhost:4000/registrations/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resList.ok) {
        const data = await resList.json();
        const arr = Array.isArray(data) ? data : [];
        const filtered = arr.filter(r => String(r.status || '').toLowerCase() !== 'cancelled');
        setRegistrations(filtered);
      } else {
        // Fallback: remove locally
        setRegistrations(list => list.filter(r => r.event_id !== eventId));
      }
      setConfirmOpen(false);
      setConfirmTarget(null);
      setSnackbarMsg('Hủy đăng ký thành công');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (e) {
      setSnackbarMsg('Lỗi khi hủy đăng ký');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setCanceling(false);
    }
  };

  const openCancelConfirm = (eventId) => {
    setConfirmTarget(eventId);
    setConfirmOpen(true);
  };

  const closeCancelConfirm = () => {
    if (canceling) return;
    setConfirmOpen(false);
    setConfirmTarget(null);
  };

  return (
    <Box className={`campaign-join-page`} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 66px)' }}>
      {/* Snackbar for feedback */}
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
          Sự kiện đã đăng ký
        </Typography>
        {/* Filter row: left status filter, right total */}
        <Box sx={{ px: { xs: 1.5, sm: 2 }, mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="status-filter-label" shrink>
              Lọc theo trạng thái
            </InputLabel>
            <Select
              labelId="status-filter-label"
              label="Lọc theo trạng thái"
              value={statusFilter}
              displayEmpty
              renderValue={(value) => statusFilterLabel(value)}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="pending">Đang chờ duyệt</MenuItem>
              <MenuItem value="approved">Đã tham gia</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="absent">Vắng mặt</MenuItem>
              <MenuItem value="rejected">Bị từ chối</MenuItem>
            </Select>
          </FormControl>
          <Typography sx={{ fontWeight: 600 }}>
            Tổng: {filteredRegs.length} chiến dịch
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        {loading ? (
          <Box sx={{ py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CircularProgress size={22} />
            <Typography>Đang tải...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : registrations.length === 0 ? (
          <Typography>Chưa có sự kiện nào.</Typography>
        ) : (
          <List>
            {filteredRegs.length === 0 ? (
              <Typography sx={{ px: 2, py: 1 }}>Không có sự kiện nào mà bạn {statusFilterLabel(statusFilter)}</Typography>
            ) : (
              filteredRegs
              .slice(page * pageSize, page * pageSize + pageSize)
              .map((reg) => {
              const st = statusLabel(reg.status);
              const title = reg.event?.title || reg.event?.name || `Sự kiện #${reg.event_id}`;
              const locationName = reg.event?.location?.name || '';
              return (
                <React.Fragment key={`${reg.event_id}-${reg.id || reg.status}`}>
                  <ListItem
                    className={`scj-item scj-${reg.status}`}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => navigate(`/events/${reg.event_id}`)}
                          sx={{ bgcolor: '#16a34a', textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#15803d', boxShadow: 'none' } }}
                        >
                          Xem chi tiết
                        </Button>
                        {(String(reg.status || '').toLowerCase() === 'pending' || (new Date(reg.event.start_time) > new Date() && reg.status !== "rejected")) && (
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => openCancelConfirm(reg.event_id)}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                          >
                            Hủy đăng ký
                          </Button>
                        )}
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                          {reg.event?.banner_url ? (
                            <Box component="img" src={reg.event.banner_url} alt={title} sx={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                          ) : (
                            <Box sx={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontWeight: 700, border: '1px solid #e2e8f0' }} aria-label="no-thumbnail">
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
                            {reg.event?.start_time ? <span>{' — vào '}{fmtStartTime(reg.event.start_time)}</span> : null}
                          </Typography>
                        ) : undefined
                      }
                    />
                  </ListItem>
                </React.Fragment>
              );
              })
            )}
          </List>
        )}
        </Box>
        {/* Bottom pagination controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, py: 1.5 }}>
          <IconButton
            size="small"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            aria-label="Trang trước"
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <Box sx={{ px: 1, py: 0.5, borderRadius: 1 }}>
            <Typography sx={{ fontSize: { xs: '.85rem', sm: '.9rem' } }}>
              Trang {page + 1} / {Math.max(1, Math.ceil(filteredRegs.length / pageSize))}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setPage((p) => (p + 1 < Math.ceil(filteredRegs.length / pageSize) ? p + 1 : p))}
            disabled={page + 1 >= Math.ceil(filteredRegs.length / pageSize)}
            aria-label="Trang sau"
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      </Paper>
      {/* Confirm cancel dialog */}
      <Dialog open={confirmOpen} onClose={closeCancelConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Hủy đăng ký</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn hủy đăng ký không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelConfirm} disabled={canceling}>Hủy</Button>
          <Button onClick={() => cancelRegistration(confirmTarget)} color="error" variant="contained" disabled={canceling}>
            {canceling ? <CircularProgress size={18} color="inherit" /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShowCampaignJoin;