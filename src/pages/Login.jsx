import Form from "../components/Form";
function Login() {
  return (
    <div className="flex  flex-col items-center justify-center min-h-screen bg-base-200">
      <h1 className="mb-6">Login Page</h1>
      <Form route="/api/token/" method="login" />
    </div>
  );
}
export default Login;
