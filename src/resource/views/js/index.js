async function load() {
    let x = document.getElementById("account").value ;
    let y = document.getElementById("password").value;
    let p = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: x, password: y })
    });
    let data = await p.json();
    if ( data.ok ) {
        window.location.href = '/dashboard';
    }
    else {
        document.getElementById("noti").innerText = "Sai tài khoản hoặc mật khẩu!";
    }
}