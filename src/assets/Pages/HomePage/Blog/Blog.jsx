import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
const Blog = () => {
  const { t } = useTranslation();
  return (
    <div className="mt-40 container mx-auto">
      <div data-aos="fade-up" data-aos-easing="linear" data-aos-duration="2000">
        <h2 className="inter text-5xl font-bold text-center ">
          {t('home.blog.header')}
        </h2>
        <p className="w-2/3 mx-auto mt-4 text-center leading-relaxed text-gray-600">
          {t('home.blog.desc')}
        </p>
      </div>

      <section
        data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1500"
        className="py-10 ws  sm:py-16 lg:py-14">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid  max-w-md grid-cols-1 mx-auto mt-12 lg:max-w-full lg:mt-16 lg:grid-cols-3 gap-x-16 gap-y-12">
            <div>
              <Link to="/article/1" title="" className="block aspect-w-4 aspect-h-3">
                <img
                  className="object-cover w-full h-60"
                  src="https://images.squarespace-cdn.com/content/v1/5e959b5110e0e16067a04ae5/a606d14e-6e13-4d3b-af85-4a1ce2f8eeeb/Volunteer+Managers+Choosing+Volunteer+Management+Software.png?format=2500w"
                  alt=""
                />
              </Link>
              <span className="inline-flex px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full text-rose-500 bg-rose-100 mt-9">
                {t('home.blog.posts.1.category')}
              </span>
              <p className="mt-6 text-xl font-semibold">
                <Link to="/article/1" title="">
                  {t('home.blog.posts.1.title')}
                </Link>
              </p>
              <p className="mt-4 text-gray-500 text-left">
                {t('home.blog.posts.1.desc')}
              </p>
              <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>
            </div>

            <div>
              <Link to="/article/2" title="" className="block aspect-w-4 aspect-h-3">
                <img
                  className="object-cover w-full h-60"
                  src="https://assets-global.website-files.com/618ec2e36c7ec23e185f0a7e/65f3faf100b564c42b63ad69_Working%20from%20home.jpg"
                  alt=""
                />
              </Link>
              <span className="inline-flex px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full text-sky-500 bg-sky-100 mt-9">
                {t('home.blog.posts.2.category')}
              </span>
              <p className="mt-6 text-xl font-semibold">
                <Link to="/article/2" title="">
                  {t('home.blog.posts.2.title')}
                </Link>
              </p>
              <p className="mt-4 text-gray-500 text-left">
                {t('home.blog.posts.2.desc')}
              </p>
              <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>
            </div>

            <div>
              <Link to="/article/3" title="" className="block aspect-w-4 aspect-h-3">
                <img
                  className="object-cover w-full h-60"
                  src="https://www.pointsoflight.org/wp-content/uploads/2023/02/dreamstime_m_198117357-1024x677.jpg"
                  alt=""
                />
              </Link>
              <span className="inline-flex px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full text-sky-500 bg-sky-100 mt-9">
                {t('home.blog.posts.3.category')}
              </span>
              <p className="mt-6 text-xl font-semibold">
                <Link to="/article/3" title="">
                  {t('home.blog.posts.3.title')}
                </Link>
              </p>
              <p className="mt-4 text-gray-500 text-left">
                {t('home.blog.posts.3.desc')}
              </p>
              <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
