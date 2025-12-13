function ErrorPage({ code }) {
  return (
    <iframe
      src={`/error_pages/${code}.html`}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
      title={`${code} Error`}
    />
  );
}

export default ErrorPage;