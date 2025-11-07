import { useEffect, useRef, useState } from "react";
import "./App.css";
function App() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 } // 20% của phần tử thấy được thì kích hoạt
    );

    observer.observe(el);

    return () => {
      // bỏ quan sát phần tử cụ thể (an toàn hơn than disconnect)
      observer.unobserve(el);
      // observer.disconnect(); // có thể dùng nếu muốn hủy toàn bộ observer
    };
  }, []); // chạy 1 lần

  return (
    <>
    <h1>Welcome to VolunteerHub!</h1>
      <div
        ref={ref}
        className={`dashboard-section ${visible ? "show" : ""}`}
      >
        <h2>Dashboard</h2>
        <p>Dữ liệu hiển thị khi scroll tới đây.</p>
      </div>
    </>
  );
}

function Login() {
  useEffect(() => {
    document.body.classList.add("bg-pink");
    return () => document.body.classList.remove("bg-pink");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const account = e.target.account.value;
    const password = e.target.password.value;
    console.log("login", { account, password });
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="card p-4 shadow-sm mt-5 bg-grey" style={{ width: "350px", height: "430px" }}>
          <h1 className="text-center mb-0">Đăng nhập</h1>
          <hr></hr>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Tên đăng nhập</label>
              <input
                type="text"
                name="account"
                className="form-control"
                placeholder="Nhập tên đăng nhập"
                style = {{ height: "45px" }}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Nhập mật khẩu"
                style = {{ height: "45px" }}
                required
              />
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="saveAccount"
              />
              <label className="form-check-label" htmlFor="saveAccount">
                Lưu mật khẩu
              </label>
            </div>

            <button type="submit" className="btn btn-pink w-100" style = {{ height: "45px" }}>
              Đăng nhập
            </button>
          </form>

          <pre id="noti" className="text-danger text-center mt-3"></pre>
        </div>
      </div>
    </>
  );
}

export { App, Login };
