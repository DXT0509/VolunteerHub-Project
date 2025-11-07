const Navbar = () => {
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-danger px-4 justify-content-between w-100 bg-pink">
        <div class="d-flex align-items-center">
          <img
            src="https://userpic.codeforces.org/1657001/title/7b916a641c436c8c.jpg"
            alt="logo"
            width="50"
            height="50"
            className="rounded-circle me-3"
          />
          
          <span
            className="text-white fw-bold mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => (window.location.href = "/")}
          >
            Trang chủ
          </span>
        </div>

        <div>
          <span
            className="text-white me-2 fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => (window.location.href = "login")}
          >
            Đăng nhập /
          </span>
          <span
            className="text-white fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => (window.location.href = "signup")}
          >
            Đăng ký
          </span>
        </div>
    </nav>
    );
}
export default Navbar;