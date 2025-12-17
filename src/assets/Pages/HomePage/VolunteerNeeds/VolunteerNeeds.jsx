import { useEffect, useState } from "react";
import VolunteerNeedsCard from "./VolunteerNeedsCard";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
const VolunteerNeeds = () => {
  // const [volunteers, setVolunteers] = useState([]);
  // useEffect(() => {
  //   const volunteers = async () => {
  //     const { data } = await axios(
  //       `${import.meta.env.VITE_API_URL}/volunteers`
  //     );
  //     setVolunteers(data);
  //   };
  //   volunteers();
  // }, []);
  const MAX_SHOW = 6;
  const [volunteers] = useState([
    {
      _id: 1,
      thumbnail: "../../../Components/Navbar/add.jpg",
      post_title: "Community Cleanup Volunteer",
      category: "Environment",
      description: "Join us to help clean up local parks and rivers. Your contribution will make a visible impact in the community.",
      deadline: "2025-12-31",
    },
    {
      _id: 2,
      thumbnail: "../../../Components/Navbar/add.jpg",
      post_title: "Food Bank Helper",
      category: "Social",
      description: "Assist in organizing and distributing food to those in need at the local food bank.",
      deadline: "2025-11-15",
    },
    {
      _id: 3,
      thumbnail: "../../../Components/Navbar/add.jpg",
      post_title: "Animal Shelter Support",
      category: "Animal Welfare",
      description: "Help take care of shelter animals, including feeding, cleaning, and socializing with them.",
      deadline: "2025-12-10",
    },
    {
      _id: 4,
      thumbnail: "../../../Components/Navbar/add.jpg",
      post_title: "Community Teaching Assistant",
      category: "Education",
      description: "Assist teachers in local community centers, helping children with reading, math, and homework.",
      deadline: "2025-12-20",
    },
    {
      _id: 5,
      thumbnail: "../../../Components/Navbar/add.jpg",
      post_title: "Community Teaching Assistant",
      category: "Education",
      description: "Assist teachers in local community centers, helping children with reading, math, and homework.",
      deadline: "2025-12-20",
    },
    {
      _id: 6,
      thumbnail: "../../../Components/Navbar/add.jpg",
      post_title: "Community Teaching Assistant",
      category: "Education",
      description: "Assist teachers in local community centers, helping children with reading, math, and homework.",
      deadline: "2025-12-20",
    },
    {
      _id: 7,
      thumbnail: "../../../Components/Navbar/add.jpg",
      post_title: "Community Teaching Assistant",
      category: "Education",
      description: "Assist teachers in local community centers, helping children with reading, math, and homework.",
      deadline: "2025-12-20",
    },
    {
      _id: 8,
      thumbnail: "../../../Components/Navbar/add.jpg",
      post_title: "Community Teaching Assistant",
      category: "Education",
      description: "Assist teachers in local community centers, helping children with reading, math, and homework.",
      deadline: "2025-12-20",
    },
  ]);


  return (
    <div

      className="py-16 font-qs"
    >
      <div data-aos="fade-left"
        data-aos-anchor-placement="top-bottom"
        data-aos-easing="linear"
        data-aos-duration="1000" className="container mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center ">
          Volunteer Needs Now
        </h2>
        <p className="w-2/3 mx-auto mt-4 text-center leading-relaxed text-gray-600">
          Volunteer Needs Now is the pulse of our community engagement. This
          section highlights current opportunities where your time and skills
          can make an immediate impact.
        </p>
      </div>

      <div className="container mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-y-12 pl-10">
        {volunteers.slice(0, MAX_SHOW).map((volunteer) => (
          <VolunteerNeedsCard
            volunteer={volunteer}
            key={volunteer._id}
          ></VolunteerNeedsCard>
        ))}
        {volunteers.length > MAX_SHOW && (
          <div className="flex justify-center mt-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-full">
            <Link to="/need-volunteer">
              <Button className=" px-10 py-4 text-2xl rounded-xl !text-white bg-blue-400 hover:bg-orange-400"
                variant="gradient">
                SEE ALL
              </Button>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default VolunteerNeeds;
