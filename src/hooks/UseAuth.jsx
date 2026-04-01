import { useEffect, useState } from "react";

export default function UseAuth() {
      const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const hasCookie = document.cookie
      .split("; ")
      .some((row) => row.startsWith("password="));

    setIsLoggedIn(!!(email && hasCookie));
  }, []);

  return isLoggedIn;

}
