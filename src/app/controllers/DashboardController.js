const EventModel = require('./../models/EventModel');
class DashboardController {
    async dashboardView(req,res) {
        try{
            const events = await EventModel.getAllEvents();
            function formatDeadline(dtStr){
                if(!dtStr) return '';
                let year,month,day,hour,minute;
                if(dtStr instanceof Date){
                    year=dtStr.getFullYear(); month=dtStr.getMonth()+1; day=dtStr.getDate(); hour=dtStr.getHours(); minute=dtStr.getMinutes();
                } else {
                    const m = String(dtStr).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
                    if(m){ year=+m[1]; month=+m[2]; day=+m[3]; hour=+m[4]; minute=+m[5]; }
                    else { const d = new Date(dtStr); year=d.getFullYear(); month=d.getMonth()+1; day=d.getDate(); hour=d.getHours(); minute=d.getMinutes(); }
                }
                const date = new Date(year, month-1, day, hour, minute);
                const dd = String(date.getDate()).padStart(2,'0');
                const mm = String(date.getMonth()+1).padStart(2,'0');
                const yyyy = date.getFullYear();
                const hh = String(date.getHours()).padStart(2,'0');
                const min = String(date.getMinutes()).padStart(2,'0');
                const weekdayMap = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
                const weekday = weekdayMap[date.getDay()];
                return `Hạn chót: ngày ${dd}/${mm}/${yyyy} lúc ${hh}:${min} - ${weekday}`;
            }
            const mapped = events.map(r => ({
                id: r.id,
                title: r.title,
                content: r.content,
                address: r.address,
                time: r.time,
                deadlineDisplay: formatDeadline(r.time),
                image: r.image || null,
                detailUrl: `/event/${r.id}`
            }));
            res.render('dashboard', { events: mapped });
        }catch(err){
            console.error('dashboardView error', err);
            res.status(500).send('Lỗi khi tải danh sách sự kiện');
        }
    }
}
module.exports = new DashboardController;