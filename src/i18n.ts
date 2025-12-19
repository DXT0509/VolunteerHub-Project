import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            banner: {
                slide1: {
                    title: 'Join Our Cause',
                    paragraph:
                        "Dive into community service and be a catalyst for change. With VolunteerHub, you're not just volunteering; you're becoming part of a movement dedicated to creating a brighter future for all.",
                },
                slide2: {
                    title: 'Empower Change',
                    paragraph:
                        'Take action and be the change you wish to see. VolunteerHub provides the platform for you to champion causes close to your heart, driving tangible impact and fostering a culture of empowerment.',
                },
                slide3: {
                    title: 'Connect and Grow',
                    paragraph:
                        'Expand your network while making a difference. VolunteerHub connects you with passionate individuals, fostering friendships and providing opportunities for personal and professional growth.',
                },
                slide4: {
                    title: 'Inspire Through Action',
                    paragraph:
                        'Lead by example and inspire others to join the movement. VolunteerHub empowers you to turn your passion into meaningful action, sparking inspiration and catalyzing positive change in your community.',
                },
                slide5: {
                    title: 'Make Your Mark',
                    paragraph:
                        'Leave a legacy of compassion and progress. VolunteerHub enables you to leave a lasting impact on the causes you care about, one volunteer opportunity at a time. Join us and make your mark on the world.',
                },
            },
            home: {
                volunteerNeeds: {
                    title: 'Volunteer Needs Now',
                    desc:
                        'Volunteer Needs Now is the pulse of our community engagement. This section highlights current opportunities where your time and skills can make an immediate impact.',
                    seeAll: 'SEE ALL',
                },
                blog: {
                    header: 'Latest Articles & Blog',
                    desc:
                        'Discover our latest articles and blog posts for insightful perspectives, expert advice, and timely updates on a diverse range of topics. Stay informed, inspired, and engaged with our thought-provoking content. Explore now for fresh insights and ideas.',
                },
                contact: {
                    header: 'Contact Us',
                    heroTitle: "It’s time to experience and do something exciting!",
                    heroDesc:
                        'We are helping our community through volunteering and here you guys can post your to get your desired volunteers.',
                    formTitle: 'Send us a message',
                    formDesc: 'Feel free to contact with us. We will response within 24 hour.',
                    nameLabel: 'Your name',
                    namePlaceholder: 'Enter your full name',
                    emailLabel: 'Email address',
                    emailPlaceholder: 'Enter your email address',
                    messageLabel: 'Your Message',
                    messagePlaceholder: 'Enter your message',
                    sendBtn: 'Send Message',
                },
            },
            nav: {
                home: 'Home',
                about: 'About',
                contact: 'Contact',
                support: 'Support',
                login: 'Login',
                logout: 'Logout',
                myCampaign: 'My Campaign',
                manage: 'Manage',
                admin: 'Admin',
            },
            manage: {
                dashboard: 'Dashboard',
                volunteers: 'Volunteers',
                campaigns: 'Campaigns',
                reports: 'Reports',
            },
            adminMenu: {
                panel: 'Admin Panel',
                settings: 'System Settings',
            },
            common: {
                language: 'Language',
                english: 'English',
                vietnamese: 'Vietnamese',
            },
        },
    },
    vi: {
        translation: {
            banner: {
                slide1: {
                    title: 'Cùng Chung Tay',
                    paragraph:
                        'Hoà mình vào cộng đồng và trở thành chất xúc tác cho sự thay đổi. Với VolunteerHub, bạn không chỉ là tình nguyện viên; bạn đang tham gia một phong trào vì một tương lai tươi sáng hơn.',
                },
                slide2: {
                    title: 'Trao Quyền Thay Đổi',
                    paragraph:
                        'Hành động để trở thành sự thay đổi bạn muốn thấy. VolunteerHub là nền tảng để bạn ủng hộ những điều mình quan tâm, tạo ra tác động rõ rệt và nuôi dưỡng văn hoá trao quyền.',
                },
                slide3: {
                    title: 'Kết Nối Và Phát Triển',
                    paragraph:
                        'Mở rộng mạng lưới trong khi tạo giá trị. VolunteerHub kết nối bạn với những người đầy nhiệt huyết, nuôi dưỡng tình bạn và cơ hội phát triển bản thân lẫn nghề nghiệp.',
                },
                slide4: {
                    title: 'Truyền Cảm Hứng Bằng Hành Động',
                    paragraph:
                        'Dẫn dắt bằng tấm gương và truyền cảm hứng cho người khác. VolunteerHub giúp bạn biến đam mê thành hành động ý nghĩa, khơi dậy cảm hứng và tạo thay đổi tích cực cho cộng đồng.',
                },
                slide5: {
                    title: 'Để Lại Dấu Ấn',
                    paragraph:
                        'Để lại di sản của lòng trắc ẩn và tiến bộ. VolunteerHub giúp bạn tạo ảnh hưởng bền vững cho những điều bạn quan tâm, từng cơ hội tình nguyện một. Hãy cùng chúng tôi tạo dấu ấn của bạn.',
                },
            },
            home: {
                volunteerNeeds: {
                    title: 'Nhu Cầu Tình Nguyện Hiện Tại',
                    desc:
                        'Mạch đập của cộng đồng nằm ở đây. Mục này nêu bật các cơ hội hiện tại nơi thời gian và kỹ năng của bạn tạo ra tác động ngay lập tức.',
                    seeAll: 'XEM TẤT CẢ',
                },
                blog: {
                    header: 'Bài Viết & Blog Mới Nhất',
                    desc:
                        'Khám phá các bài viết và blog mới nhất với góc nhìn sâu sắc, lời khuyên hữu ích và cập nhật kịp thời. Luôn nắm bắt, truyền cảm hứng và tương tác với nội dung giàu suy ngẫm. Bắt đầu ngay để có thêm ý tưởng mới.',
                },
                contact: {
                    header: 'Liên hệ',
                    heroTitle: 'Đã đến lúc trải nghiệm và làm điều thú vị!',
                    heroDesc:
                        'Chúng tôi đang giúp cộng đồng thông qua hoạt động tình nguyện, và bạn có thể đăng bài để tìm được tình nguyện viên phù hợp.',
                    formTitle: 'Gửi tin nhắn cho chúng tôi',
                    formDesc: 'Bạn cứ thoải mái liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
                    nameLabel: 'Họ và tên',
                    namePlaceholder: 'Nhập họ và tên của bạn',
                    emailLabel: 'Địa chỉ email',
                    emailPlaceholder: 'Nhập địa chỉ email của bạn',
                    messageLabel: 'Tin nhắn',
                    messagePlaceholder: 'Nhập nội dung tin nhắn',
                    sendBtn: 'Gửi Tin Nhắn',
                },
            },
            nav: {
                home: 'Trang chủ',
                about: 'Giới thiệu',
                contact: 'Liên hệ',
                support: 'Hỗ trợ',
                login: 'Đăng nhập',
                logout: 'Đăng xuất',
                myCampaign: 'Chiến dịch của tôi',
                manage: 'Quản lý',
                admin: 'Quản trị',
            },
            manage: {
                dashboard: 'Bảng điều khiển',
                volunteers: 'Tình nguyện viên',
                campaigns: 'Chiến dịch',
                reports: 'Báo cáo',
            },
            adminMenu: {
                panel: 'Trang quản trị',
                settings: 'Thiết lập hệ thống',
            },
            common: {
                language: 'Ngôn ngữ',
                english: 'Tiếng Anh',
                vietnamese: 'Tiếng Việt',
            },
        },
    },
} as const;

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
    });

export default i18n;
