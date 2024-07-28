const Login = () => {
  return (
    <div className={styles.loginForm_wrapper}>
      <h1>로그인 하기</h1>
      <input placeholder="아이디를 입력하세요..."></input>
      <input placeholder="비밀번호를 입력하세요..."></input>
      <button>로그인 하기</button>
      <button onClick={() => navigate("/signup")}>회원가입 하기</button>
    </div>
  );
};

export default Login;
