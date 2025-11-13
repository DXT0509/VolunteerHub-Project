import React, { useRef } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, Slide } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import './ShowCampaignDetail.css';
/**
 * ShowCampaignDetail
 * Props: { title, category, location, deadline, capacity, manager_name, manager_mail, banner_url }
 * Layout: left large banner image, right column with nicely formatted information.
 */
const SlideFromTop = React.forwardRef(function SlideFromTop(props, ref) {
  return <Slide ref={ref} {...props} direction="down" timeout={{ enter: 400, exit: 350 }} />;
});

function ShowCampaignDetail() {
  const fmtDeadline = (d) => {
  if (!d) return 'Không có thời hạn';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]); 
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [warnMsg, setWarnMsg] = useState("");
  const [showWarn, setShowWarn] = useState(false);

  // Refs for animation targets (declare before any early return)
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // Guard: only allow when logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      navigate('/login', { replace: true });
    } else {
      setAllowed(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (!allowed) return;
    fetch(`http://localhost:4000/events/${id}`)
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(err => console.error(err));
  }, [id, allowed]);
  useEffect(() => {
    fetch(`http://localhost:4000/registrations/my`,{
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => setUserRegistrations(data))
    .catch(err => console.error(err));
  }, [allowed]);

  function getRegistrationStatus(eventId) {
    const registration = userRegistrations.find(reg => reg.event_id === eventId);
    return registration ? registration.status : 'not_registered';
  }

  async function handleCancel(eventId) {
    try {
      await fetch(`http://localhost:4000/registrations/${eventId}/register`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      // Refresh registrations list after cancellation
      const res = await fetch(`http://localhost:4000/registrations/my`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setUserRegistrations(data);
    } catch (e) {
      console.error('Cancel failed', e);
    }
  }

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);
  const confirmCancel = async () => {
    closeConfirm();
    await handleCancel(event.id);
  };


  const bannerFallback = (
    <div className="scd-fallback">
      <span>Không có ảnh</span>
    </div>
  );
  // use the top-level forwardRef SlideFromTop for Snackbar transitions
  

  useEffect(() => {
    const targets = [leftRef.current, rightRef.current].filter(Boolean);
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [event]);

  if (!allowed) return null;
  if (!event) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="scd-container">
      {/* Top-center alert like Register.jsx */}
      <Snackbar
        open={showWarn}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setShowWarn(false);
        }}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideFromTop}
        sx={{ mt: 2 }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{
            px: 2,
            py: 1,
            borderRadius: 1.5,
            boxShadow: 2,
            width: '420px',
            backgroundColor: '#facc15',
            color: '#78350f',
            '& .MuiAlert-icon': { mr: 1 },
            '& .MuiAlert-message': { fontSize: '0.95rem', fontWeight: 500 },
          }}
        >
          {warnMsg}
        </Alert>
      </Snackbar>
      <title>Campaign Details</title>
      <div ref={leftRef} className="scd-left scd-animate">
        {event.banner_url ? (
          <img src={event.banner_url} alt={event.title} className="scd-img" />
        ) : (
          bannerFallback
        )}
      </div>
      <div ref={rightRef} className="scd-right scd-animate">
        <div>
          <h1 className="scd-title">{event.title}</h1>
          <div className="scd-category">
            <h4>Thể loại: <strong>{event.category?.name}</strong></h4>
          </div>
          <div className="scd-desc">
            <span>{event.description}</span>
          </div>
          <h5 className="scd-location">Địa điểm: <span><strong>{event.location?.name}</strong></span></h5>
          <span className = "scd-location">
            <span>{event.location?.address_line}, {event.location?.district}, {event.location?.province}, {event.location?.country}</span>
          </span>
          <div className="scd-details">
            {/* Two-column grid: col 1 = Deadline & Contact, col 2 = Capacity & Manager */}
            <div className="scd-grid">
              {/* Row 1 */}
              <div>
                <div className="scd-label">Hạn chót</div>
                <div className="scd-value">{fmtDeadline(event.end_time)}</div>
              </div>
              <div>
                <div className="scd-label">Số TNV còn thiếu</div>
                <div className="scd-capacity-row">
                  <div className="scd-badge" title="Total volunteers">
                    {typeof event.capacity === 'number' ? event.capacity : (event.capacity || '—')}
                  </div>
                  tình nguyện viên
                </div>
              </div>

              {/* Row 2 */}
              <div>
                <div className="scd-label">Người quản lý</div>
                <div className="scd-value">{event.manager?.full_name ?? '—'}</div>
              </div>
              <div>
                <div className="scd-label">Liên hệ</div>
                {event.manager?.email ? (
                  <a href={`mailto:${event.manager.email}`} className="scd-link">{event.manager.email}</a>
                ) : (
                  <div className="scd-value">—</div>
                )}
              </div>
              
            </div>
          </div>
        </div>
        <div className="scd-actions">
          {(() => {
            const status = getRegistrationStatus(event.id);
            if (status === 'pending') {
              return (
                <Button
                  variant="contained"
                  onClick={() => {setConfirmOpen(true);}}
                  sx={{
                    bgcolor: '#facc15',
                    color: '#78350f',
                    cursor: 'default',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#facc15' }
                  }}
                >
                  <WarningAmberIcon sx={{ mr: 1 }} /> Đang chờ duyệt đơn đăng ký
                </Button>
              );
            }
            if (status === 'approved') {
              return (
                <Button
                  variant="contained"
                  onClick={() => {setConfirmOpen(true);}}
                  sx={{
                    bgcolor: '#dc2626',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#b91c1c' }
                  }}
                >
                  <CancelIcon sx={{ mr: 1 }} /> Đã tham gia, hủy đăng ký
                </Button>
              );
            }
            return (
              <Button
                className="scd-join-btn"
                variant="contained"
                onClick={() => navigate(`/bevolunteer/${id}`)}
                sx={{ bgcolor: '#16a34a', textTransform: 'none', '&:hover': { bgcolor: '#15803d' } }}
              >
                Đăng ký tham gia
              </Button>
            );
          })()}
          <Button
            style={{ marginLeft: '85px' }}
            variant="contained"
            onClick={() => {
              const status = getRegistrationStatus(event.id);
              if (status !== 'approved') {
                setWarnMsg('Bạn chưa tham gia sự kiện');
                setShowWarn(true);
                return;
              }
              navigate(`/exchange-channel/${id}`);
            }}
            sx={{
              ml: 2,
              bgcolor: '#8d919aff',
              textTransform: 'none',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { bgcolor: '#767a7eff' }
            }}
          >
            <span style={{ fontWeight: 700 }}>→</span> Truy cập kênh trao đổi
          </Button>
        </div>
        {/* Confirm cancellation dialog */}
        <Dialog open={confirmOpen} onClose={closeConfirm}>
          <DialogTitle>Xác nhận hủy đăng ký tham gia sự kiện</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn hủy đăng ký tham gia sự kiện này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirm} variant="contained" sx={{ bgcolor: '#9ca3af', '&:hover': { bgcolor: '#6b7280' }, textTransform: 'none' }}>
              Hủy
            </Button>
            <Button onClick={confirmCancel} variant="contained" sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, textTransform: 'none' }} autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default ShowCampaignDetail;