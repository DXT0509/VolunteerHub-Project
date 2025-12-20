// Article.tsx
import React, { useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { useParams, Link } from "react-router-dom";

type ArticleItem = {
    id: string;
    title: string;
    author: string;
    date: string;
    imageUrl?: string;
    content: string[];
};

const ARTICLES: ArticleItem[] = [
    {
        id: "1",
        title: "Tối ưu quản lý tình nguyện viên với công nghệ",
        author: "Volunteer Hub Team",
        date: "20/12/2025",
        imageUrl:
            "https://images.squarespace-cdn.com/content/v1/5e959b5110e0e16067a04ae5/a606d14e-6e13-4d3b-af85-4a1ce2f8eeeb/Volunteer+Managers+Choosing+Volunteer+Management+Software.png?format=2500w",
        content: [
            "Trong bối cảnh xã hội hiện đại, hoạt động tình nguyện ngày càng trở thành một phần quan trọng trong phát triển cộng đồng. Các tổ chức phi lợi nhuận, trường học, bệnh viện và nhiều dự án xã hội khác đều dựa vào sự đóng góp của tình nguyện viên để thực hiện sứ mệnh của mình. Tuy nhiên, việc quản lý một lượng lớn tình nguyện viên thường gặp nhiều khó khăn: từ việc đăng ký, phân công công việc, theo dõi tiến độ, đến đánh giá hiệu quả. Trong bối cảnh đó, công nghệ đang nổi lên như một công cụ đắc lực giúp tối ưu hóa quản lý tình nguyện viên, nâng cao hiệu quả hoạt động và trải nghiệm của người tham gia.",
            "Áp dụng nền tảng số giúp kết nối, phân công và theo dõi hiệu quả hơn.",
            "Trong bối cảnh đó, công nghệ hiện đại trở thành công cụ đắc lực để tối ưu hóa quản lý tình nguyện viên, nâng cao hiệu quả hoạt động và trải nghiệm của người tham gia. Các hệ thống quản lý tình nguyện viên cho phép lưu trữ toàn bộ thông tin cá nhân, kỹ năng, lịch sử tham gia và ưu tiên công việc của từng tình nguyện viên. Nền tảng công nghệ có thể tự động phân công nhiệm vụ dựa trên kỹ năng, vị trí và thời gian sẵn sàng, đồng thời gửi nhắc nhở qua email hoặc tin nhắn, giúp giảm khối lượng công việc hành chính. Việc tích hợp các kênh thông báo, chat nhóm hoặc diễn đàn còn giúp tình nguyện viên cập nhật thông tin quan trọng một cách nhanh chóng. Các hệ thống này cũng cung cấp báo cáo chi tiết về số giờ làm việc, đóng góp và đánh giá chất lượng công việc, hỗ trợ tổ chức cải thiện quy trình và ghi nhận thành tích của tình nguyện viên.",
            "Nhiều tổ chức đã áp dụng thành công các ứng dụng quản lý tình nguyện trực tuyến như VolunteerHub, SignUpGenius hay GivePulse, kết hợp với hệ thống CRM cho phi lợi nhuận và ứng dụng di động để ghi nhận giờ làm việc trực tiếp. Thậm chí, phân tích dữ liệu và AI còn giúp dự đoán nhu cầu, phân tích hành vi và tối ưu hóa nguồn lực tình nguyện. Khi được áp dụng đúng cách, công nghệ không chỉ giúp giảm tải công việc hành chính mà còn tăng khả năng giữ chân tình nguyện viên nhờ trải nghiệm thuận tiện và minh bạch, nâng cao hiệu quả hoạt động và chất lượng dịch vụ, đồng thời tạo cơ sở dữ liệu phong phú phục vụ cho kế hoạch dài hạn và ra quyết định. Ngoài ra, công nghệ còn giúp ghi nhận và tôn vinh đóng góp của tình nguyện viên một cách công bằng và minh bạch, tạo động lực gắn kết lâu dài.",
            "Trong thời đại số, việc tối ưu quản lý tình nguyện viên bằng công nghệ trở thành yếu tố thiết yếu để các tổ chức xã hội hoạt động hiệu quả và bền vững. Đầu tư vào các nền tảng quản lý thông minh giúp giảm tải khối lượng công việc, tăng cường kết nối và gắn kết tình nguyện viên, từ đó tạo ra những tác động tích cực lớn hơn cho cộng đồng."
        ],
    },
    {
        id: "2",
        title: "Cân bằng công việc từ xa trong hoạt động thiện nguyện",
        author: "Community Insights",
        date: "18/12/2025",
        imageUrl:
            "https://assets-global.website-files.com/618ec2e36c7ec23e185f0a7e/65f3faf100b564c42b63ad69_Working%20from%20home.jpg",
        content: [
            "Trong bối cảnh công nghệ số phát triển mạnh mẽ và xu hướng làm việc từ xa trở nên phổ biến, hoạt động thiện nguyện cũng đang dần thích nghi với hình thức này. Nhiều tổ chức phi lợi nhuận, các dự án cộng đồng và nhóm tình nguyện đang triển khai các nhiệm vụ trực tuyến, từ gây quỹ, vận động xã hội, tư vấn, đào tạo cho đến tổ chức sự kiện. Tuy nhiên, việc cân bằng công việc từ xa trong hoạt động thiện nguyện đặt ra nhiều thách thức riêng, đòi hỏi cả người điều phối và tình nguyện viên phải điều chỉnh linh hoạt để duy trì hiệu quả và gắn kết.",
            "Một trong những khó khăn lớn nhất là việc quản lý thời gian. Khi tình nguyện viên thực hiện công việc từ xa, họ thường phải sắp xếp song song với công việc chính hoặc học tập, dẫn đến nguy cơ quá tải hoặc lãng phí thời gian nếu không có lịch trình rõ ràng. Ngoài ra, thiếu tương tác trực tiếp dễ tạo cảm giác xa cách, giảm động lực và sự gắn kết với tổ chức. Việc giao tiếp qua email, chat hay video call đôi khi không đủ để giải quyết các vấn đề phát sinh, khiến thông tin bị trễ hoặc hiểu nhầm.",
            "Công nghệ đóng vai trò quan trọng trong việc hỗ trợ cân bằng công việc từ xa trong thiện nguyện. Các nền tảng quản lý tình nguyện trực tuyến, ứng dụng giao tiếp nhóm, và công cụ lập lịch giúp phân công công việc minh bạch, theo dõi tiến độ và nhắc nhở tình nguyện viên đúng thời hạn. Việc áp dụng hệ thống quản lý dự án trực tuyến giúp mọi người dễ dàng cập nhật tiến độ công việc, trao đổi ý tưởng và báo cáo kết quả, đồng thời giảm bớt gánh nặng quản lý hành chính.",
            "Để duy trì cân bằng, các tổ chức cũng cần xây dựng những quy định linh hoạt về thời gian tham gia, khối lượng công việc và kỳ vọng đối với tình nguyện viên. Việc tổ chức các buổi họp trực tuyến định kỳ, kết hợp các hoạt động tương tác, đào tạo và ghi nhận thành tích cũng góp phần tăng sự gắn kết và tạo động lực cho người tham gia. Đồng thời, tình nguyện viên cần chủ động sắp xếp thời gian, đặt giới hạn và sử dụng các công cụ hỗ trợ quản lý công việc để đảm bảo cân bằng giữa công việc chính, cuộc sống cá nhân và hoạt động thiện nguyện.",
            "Cân bằng công việc từ xa trong hoạt động thiện nguyện không chỉ giúp tối ưu hóa hiệu quả của từng dự án mà còn nâng cao trải nghiệm cho tình nguyện viên, tạo ra môi trường bền vững và phát triển lâu dài cho các tổ chức xã hội. Khi được thực hiện một cách khoa học và linh hoạt, công việc thiện nguyện từ xa vừa đảm bảo hiệu quả công tác, vừa giúp người tham gia duy trì trạng thái cân bằng giữa trách nhiệm và niềm vui khi cống hiến cho cộng đồng."
        ],
    },
    {
        id: "3",
        title: "Lan tỏa tinh thần tình nguyện trong cộng đồng",
        author: "Points of Light",
        date: "10/12/2025",
        imageUrl:
            "https://www.pointsoflight.org/wp-content/uploads/2023/02/dreamstime_m_198117357-1024x677.jpg",
        content: [
            "Tinh thần tình nguyện là một trong những giá trị cốt lõi giúp xây dựng cộng đồng gắn kết, nhân văn và bền vững. Lan tỏa tinh thần này không chỉ dựa vào các chiến dịch truyền thông hay sự kiện lớn mà còn bắt nguồn từ những hành động nhỏ, đều đặn và có ý nghĩa trong đời sống hàng ngày. Khi mỗi người tham gia đóng góp sức lực, thời gian hoặc kỹ năng của mình cho cộng đồng, họ không chỉ mang lại lợi ích trực tiếp cho những người được giúp đỡ mà còn tạo ra hiệu ứng lan tỏa, truyền cảm hứng cho những người xung quanh.",
            "Một trong những cách quan trọng để lan tỏa tinh thần tình nguyện là xây dựng văn hóa tham gia chủ động. Các tổ chức, trường học và nhóm cộng đồng có thể tổ chức các hoạt động thiết thực, dễ tiếp cận như dọn vệ sinh, chăm sóc người già, hỗ trợ trẻ em, hay các chiến dịch gây quỹ trực tuyến. Khi những hoạt động này được chia sẻ rộng rãi trên mạng xã hội hoặc qua các kênh truyền thông nội bộ, không chỉ người tham gia mà cả cộng đồng sẽ cảm nhận được giá trị của việc chung tay, từ đó khích lệ nhiều người hơn cùng tham gia.",
            "Công nghệ cũng đóng vai trò quan trọng trong việc lan tỏa tinh thần tình nguyện. Các nền tảng quản lý tình nguyện trực tuyến, ứng dụng di động hay mạng xã hội giúp kết nối người muốn tham gia với những dự án cần hỗ trợ, đồng thời cung cấp thông tin minh bạch về mục tiêu, tiến độ và kết quả hoạt động. Nhờ đó, người tham gia cảm thấy công việc của mình có ý nghĩa và dễ dàng chia sẻ trải nghiệm, tạo hiệu ứng domino trong cộng đồng.",
            "Giáo dục và tuyên truyền cũng là yếu tố then chốt. Khi tinh thần tình nguyện được lồng ghép vào chương trình giảng dạy, hoạt động ngoại khóa và các buổi hội thảo cộng đồng, thế hệ trẻ sẽ hình thành thói quen cống hiến và hiểu rõ tầm quan trọng của việc giúp đỡ người khác. Những câu chuyện, hình ảnh và trải nghiệm thực tế về tình nguyện giúp mọi người cảm nhận rõ giá trị của việc chia sẻ, từ đó trở thành động lực để họ hành động.",
            "Lan tỏa tinh thần tình nguyện không chỉ là hành động cá nhân mà còn là một phong trào cộng đồng, nơi mỗi đóng góp dù nhỏ cũng tạo ra tác động tích cực. Khi nhiều người cùng tham gia, những hành động ấy sẽ cộng hưởng, giúp xây dựng một xã hội gắn kết, nhân ái và đầy sức sống. Việc duy trì và phát triển tinh thần tình nguyện liên tục sẽ tạo ra một nền tảng vững chắc cho các hoạt động cộng đồng, khơi dậy lòng nhân ái và khuyến khích mọi người cùng chung tay vì những giá trị tốt đẹp hơn."
        ],
    },
];

const Article: React.FC = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const article = useMemo(() => {
        return ARTICLES.find((a) => a.id === id) ?? ARTICLES[0];
    }, [id]);

    const titleKey = `home.article.items.${article.id}.title`;
    const paragraphKeyPrefix = `home.article.items.${article.id}.content.`;
    const localizedTitle = t(titleKey, { defaultValue: article.title });
    const localizedParagraphs = article.content.map((p, idx) =>
        t(`${paragraphKeyPrefix}${idx}`, { defaultValue: p })
    );

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8 text-left">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{localizedTitle}</h1>
            <p className="text-sm text-gray-500 mb-4">
                {t('home.article.by', { defaultValue: 'By' })} <span className="font-semibold">{article.author}</span> | {article.date}
            </p>

            {article.imageUrl && (
                <img
                    src={article.imageUrl}
                    alt={localizedTitle}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
            )}

            <div className="space-y-4 text-gray-700 leading-relaxed">
                {localizedParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 text-gray-600">
                <p>{t('home.article.rightsFormat', { year: new Date().getFullYear(), author: article.author, defaultValue: '© {{year}} {{author}}. All rights reserved.' })}</p>
            </div>
        </div>
    );
};

export default Article;
