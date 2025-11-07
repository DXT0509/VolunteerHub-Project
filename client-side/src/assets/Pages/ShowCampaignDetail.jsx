import React, { useRef } from 'react';
import { Button } from '@mui/material';
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import './ShowCampaignDetail.css';
/**
 * ShowCampaignDetail
 * Props: { title, category, location, deadline, capacity, manager_name, manager_mail, banner_url }
 * Layout: left large banner image, right column with nicely formatted information.
 */
function ShowCampaignDetail() {
  const fmtDeadline = (d) => {
  if (!d) return 'No deadline';
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

  // Refs for animation targets (declare before any early return)
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`)
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(err => console.error(err));
  }, [id]);

  const bannerFallback = (
    <div className="scd-fallback">
      <span>No image</span>
    </div>
  );
  

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

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="scd-container">
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
            <h4><strong>Category: </strong> {event.category}</h4>
          </div>
          <div className="scd-desc">
            <span>{event.description}</span>
          </div>
          <h5 className="scd-location">Location: <span>{event.location}</span></h5>
          <div className="scd-details">
            {/* Two-column grid: col 1 = Deadline & Contact, col 2 = Capacity & Manager */}
            <div className="scd-grid">
              {/* Row 1 */}
              <div>
                <div className="scd-label">Deadline</div>
                <div className="scd-value">{fmtDeadline(event.deadline)}</div>
              </div>
              <div>
                <div className="scd-label">Volunteers needed left</div>
                <div className="scd-capacity-row">
                  <div className="scd-badge" title="Total volunteers">
                    {typeof event.capacity === 'number' ? event.capacity : (event.capacity || '—')}
                  </div>
                  volunteers
                </div>
              </div>

              {/* Row 2 */}
              <div>
                <div className="scd-label">Manager</div>
                <div className="scd-value">{event.manager_name ?? '—'}</div>
              </div>
              <div>
                <div className="scd-label">Contact</div>
                {event.manager_mail ? (
                  <a href={`mailto:${event.manager_mail}`} className="scd-link">{event.manager_mail}</a>
                ) : (
                  <div className="scd-value">—</div>
                )}
              </div>
              
            </div>
          </div>
        </div>
        <div className="scd-actions">
          <Button
            className="scd-join-btn"
            variant="contained"
            sx={{ bgcolor: '#16a34a', textTransform: 'none', '&:hover': { bgcolor: '#15803d' } }}
          >
            Join Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShowCampaignDetail;