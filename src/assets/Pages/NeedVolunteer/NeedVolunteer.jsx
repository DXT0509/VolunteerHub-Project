import { Link, useNavigation } from "react-router-dom";
import VolunteerNeedsCard from "../Homepage/VolunteerNeeds/VolunteerNeedsCard";
import { useState } from "react";
import * as React from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// removed Material Tailwind Button; use Tailwind classes directly for visibility
import { useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import LoadingGif from "../../Components/Loader/LoadingGif";

// Dữ liệu mẫu tạm thời để test cùng với dữ liệu từ BE
const SAMPLE_VOLUNTEERS = [
  {
    _id: "sample-1",
    post_title: "Hỗ trợ phát quà cuối tuần",
    category: "Community Service",
    deadline: "2026-01-15",
    location: "Hà Nội",
    noOfVolunteer: 12,
    thumbnail: "https://via.placeholder.com/400x180?text=Volunteer+HN",
    description:
      "Tham gia phát quà và bữa ăn ấm áp cho người vô gia cư tại khu vực trung tâm Hà Nội.",
    organizationInformation: { orgName: "Tổ chức Trái Tim" },
  },
  {
    _id: "sample-2",
    post_title: "Dạy kèm cuối tuần cho trẻ em",
    category: "Education",
    deadline: "2026-02-01",
    location: "TP. Hồ Chí Minh",
    noOfVolunteer: 8,
    thumbnail: "https://via.placeholder.com/400x180?text=Volunteer+HCM",
    description:
      "Hỗ trợ dạy kèm Toán và Tiếng Việt cho trẻ em có hoàn cảnh khó khăn tại quận 8.",
    organizationInformation: { orgName: "Cộng đồng Yêu Thương" },
  },
  {
    _id: "sample-3",
    post_title: "Trồng cây gây rừng ven biển",
    category: "Environment",
    deadline: "2026-03-10",
    location: "Đà Nẵng",
    noOfVolunteer: 20,
    thumbnail: "https://via.placeholder.com/400x180?text=Volunteer+DN",
    description:
      "Chung tay trồng cây phủ xanh khu vực ven biển, góp phần bảo vệ môi trường và hệ sinh thái.",
    organizationInformation: { orgName: "Green Future VN" },
  },
  {
    _id: "sample-4",
    post_title: "Trồng cây gây rừng ven biển",
    category: "Environment",
    deadline: "2026-09-10",
    location: "Đà Nẵng",
    noOfVolunteer: 20,
    thumbnail: "https://via.placeholder.com/400x180?text=Volunteer+DN",
    description:
      "Chung tay trồng cây phủ xanh khu vực ven biển, góp phần bảo vệ môi trường và hệ sinh thái.",
    organizationInformation: { orgName: "Green Future VN" },
  },
];

const NeedVolunteer = ({ title }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const getData = async () => {
      // Lọc dữ liệu mẫu theo từ khoá tìm kiếm (client-side)
      const sampleFiltered = SAMPLE_VOLUNTEERS.filter((v) =>
        v.post_title.toLowerCase().includes(search.toLowerCase())
      );
      // Hiển thị ngay dữ liệu mẫu trong lúc chờ BE
      setVolunteers(sampleFiltered);
      try {
        const { data } = await axios(
          `${import.meta.env.VITE_API_URL}/need-volunteers?search=${search}`
        );
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];
        // Hợp nhất dữ liệu mẫu và dữ liệu từ BE
        setVolunteers([...sampleFiltered, ...normalized]);
      } catch (err) {
        console.error("Failed to fetch volunteers:", err);
        // Nếu lỗi BE, vẫn giữ dữ liệu mẫu để test
        setVolunteers(sampleFiltered);
      } finally {
        setShowLoader(false);
      }
    };
    getData();
  }, [search]);
  console.log(volunteers);
  const [view, setView] = React.useState("module");

  const [gridView, setGridView] = useState(true);
  const [tableView, setTableView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deadlineSort, setDeadlineSort] = useState("none"); // none | asc | desc

  const categories = React.useMemo(() => {
    const arr = Array.isArray(volunteers) ? volunteers : [];
    const set = new Set(arr.map((v) => v.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [volunteers]);

  const displayedVolunteers = React.useMemo(() => {
    const dataArray = Array.isArray(volunteers) ? volunteers : [];
    const filtered = selectedCategory && selectedCategory !== "All"
      ? dataArray.filter((v) => v.category === selectedCategory)
      : dataArray;
    const sorted = [...filtered];
    if (deadlineSort === "asc" || deadlineSort === "desc") {
      sorted.sort((a, b) => {
        const ad = new Date(a?.deadline);
        const bd = new Date(b?.deadline);
        const aValid = !isNaN(ad.getTime());
        const bValid = !isNaN(bd.getTime());
        if (!aValid && !bValid) return 0;
        if (!aValid) return 1;
        if (!bValid) return -1;
        return deadlineSort === "asc" ? ad - bd : bd - ad;
      });
    }
    return sorted;
  }, [volunteers, selectedCategory, deadlineSort]);

  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  const handleSearch = () => {
    console.log("searching text is", searchText);
    setSearch(searchText);
  };

  const handleGrid = (e) => {
    setTableView(!e);
    setGridView(e);
  };
  const handleTable = (e) => {
    setTableView(e);
    setGridView(!e);
    console.log(tableView);
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const handleSortChange = (e) => {
    setDeadlineSort(e.target.value);
  };
  const navigation = useNavigation();
  if (navigation.state === "loading") return <LoadingGif />;
  return (
    <div className="py-16 font-qs">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div
        data-aos="fade-left"
        data-aos-anchor-placement="top-bottom"
        data-aos-easing="linear"
        data-aos-duration="1500"
        className="container mx-auto mb-6"
      >
        <h2 className="text-2xl md:text-5xl font-bold text-center ">
          Join Our Community: Volunteer Opportunities
        </h2>
        <p className="w-2/3 mx-auto md:text-lg mt-4 text-center leading-relaxed ">
          Discover meaningful ways to contribute to our mission. Explore diverse
          volunteer roles and make a difference in your community. Join us in
          creating positive change today.
        </p>
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between container mx-auto px-16">
        <div
          data-aos="fade-down"
          data-aos-anchor-placement="top-bottom"
          data-aos-easing="linear"
          data-aos-duration="1000"
          className="flex container justify-center my-8 md:justify-start "
        >
          <ToggleButtonGroup
            orientation="horizontal"
            value={view}
            exclusive
            className="bg-gray-200"
            onChange={handleChange}
          >
            <ToggleButton
              onClick={() => handleGrid(true)}
              value="module"
              aria-label="module"
            >
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton
              onClick={() => handleTable(true)}
              value="list"
              aria-label="list"
            >
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {/* Filter & Sort controls */}
        <div
          data-aos="fade-down"
          data-aos-anchor-placement="top-bottom"
          data-aos-easing="linear"
          data-aos-duration="1000"
          className="flex container mx-auto justify-center md:justify-center"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">
              Filter by Category
            </label>

            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="rounded-lg border border-gray-500/60 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label className="text-sm font-semibold text-gray-700">
              Sort by Deadline
            </label>

            <select
              value={deadlineSort}
              onChange={handleSortChange}
              className="rounded-lg border border-gray-500/60 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">None</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

        </div>
        <div
          data-aos="fade-down"
          data-aos-anchor-placement="top-bottom"
          data-aos-easing="linear"
          data-aos-duration="1000"
          className="flex container  mx-auto justify-center my-8 md:justify-end"
        >
          <div className="flex p-1  border rounded-lg    focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
            <input
              className="px-6 py-2 border-none text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent"
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              name="search"
              placeholder="Enter the Post Title"
              aria-label="Enter the Post Title"
            />

            <button
              onClick={() => handleSearch()}
              type="button"
              className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium uppercase leading-normal text-white shadow transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 active:bg-blue-800"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {(!Array.isArray(volunteers) || volunteers.length === 0) && showLoader ? (
        <LoadingGif></LoadingGif>
      ) : (
        <div>
          <div className={gridView ? "block" : "hidden"}>
            <div className=" container mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-y-12">
              {displayedVolunteers.map((volunteer) => (
                <VolunteerNeedsCard
                  volunteer={volunteer}
                  key={volunteer._id}
                ></VolunteerNeedsCard>
              ))}
            </div>
          </div>
          <div className={!tableView ? "hidden" : "block"}>
            <div data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1500" className="container mx-auto mt-16">
              <div className="hidden md:block p-8">
                <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                  <table className="min-w-full border-collapse bg-white">
                    {/* head */}
                    <thead>
                      <tr className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm uppercase tracking-wide">
                        <th className="px-4 py-3 text-left rounded-tl-xl">#</th>
                        <th className="px-4 py-3 text-left">Post Title</th>
                        <th className="px-4 py-3 text-left">Posted By</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Deadline</th>
                        <th className="px-4 py-3 text-left">Location</th>
                        <th className="px-4 py-3 text-center">Volunteer Needed</th>
                        <th className="px-4 py-3 text-center rounded-tr-xl">
                          View Details
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {displayedVolunteers.map((post, idx) => (
                        <tr
                          key={post._id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                        >
                          <td className="px-4 py-3 font-medium text-gray-700 text-left">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800 text-left">
                            {post.post_title}
                          </td>
                          <td className="px-4 py-3 text-gray-700 text-left">
                            {post.organizationInformation.orgName}
                          </td>
                          <td className="px-4 py-3 text-gray-700 text-left">
                            {post.category}
                          </td>
                          <td className="px-4 py-3 text-gray-700 text-left">
                            {post.deadline}
                          </td>
                          <td className="px-4 py-3 text-gray-700 text-left">
                            {post.location}
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-indigo-600">
                            {post.noOfVolunteer}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Link to={`/post-details/${post._id}`}>
                              <button
                                type="button"
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-green-800 transition"
                              >
                                View Details
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>


              {/* Small  */}
              <div>
                <div data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1500" className=" md:hidden">
                  <div className="overflow-x-auto ">
                    <table className="table border-collapse border border-gray-400">
                      {/* head */}
                      <thead>
                        <tr className="text-white raleway text-base bg-[#DE00DF]">
                          <th>Post Title </th>
                          <th>Deadline</th>
                          <th>View Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* row 1 */}
                        {displayedVolunteers.map((post) => (
                          <tr className="border border-gray-300" key={post._id}>
                            <td>{post.post_title}</td>
                            <td>{post.deadline}</td>
                            <td>
                              <Link to={`/post-details/${post._id}`}>
                                <button
                                  type="button"
                                  className="inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-green-800"
                                >
                                  View Details
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
NeedVolunteer.propTypes = {
  title: PropTypes.string.isRequired,
}
export default NeedVolunteer;
