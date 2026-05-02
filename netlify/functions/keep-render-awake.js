exports.handler = async () => {
  const healthUrl = "https://codelearn-hub-backend.onrender.com/api/health";

  try {
    const response = await fetch(healthUrl, {
      method: "GET",
      headers: {
        "User-Agent": "netlify-keep-render-awake"
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: response.ok,
        pinged: healthUrl,
        status: response.status,
        at: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        pinged: healthUrl,
        error: error.message,
        at: new Date().toISOString()
      })
    };
  }
};
