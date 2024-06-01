import { useState } from "react";
import styles from "./RegisterForm.module.css";

function RegisterForm() {
  const USER_REGEX = /^[A-Z][a-z]{1,14}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PWD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [isUnsuccessfull, setIsUnsucessfull] = useState(false);

  function handleFormSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...formData } = data;

      setIsPending(true);

      // url от бэка - http://127.0.0.1:8000/register/

      fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          setIsPending(false);
          if (response.ok) {
            setIsSuccessfull(true);
          } else {
            setIsUnsucessfull(true);
          }
        })
        .catch((error) => {
          setIsPending(false);
          setIsUnsucessfull(true);
        });
    }
  }

  function handleInputChange(e, name) {
    const { value } = e.target;
    setData({ ...data, [name]: value });
    validateField(name, value);
  }

  function validateField(name, value) {
    let error = "";
    switch (name) {
      case "username":
        if (!USER_REGEX.test(value)) {
          error =
            "Username must start with a capital letter and be 2-15 characters long. (English only)";
        }
        break;
      case "email":
        if (!EMAIL_REGEX.test(value)) {
          error = "Invalid email address.";
        }
        break;
      case "password":
        if (!PWD_REGEX.test(value)) {
          error =
            "Password must be at least 6 characters long, contain a capital letter, a lowercase letter, and a digit.";
        }
        break;
      case "confirmPassword":
        if (value !== data.password) {
          error = "Passwords do not match.";
        }
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  }

  function validateForm() {
    const { username, email, password, confirmPassword } = data;
    const usernameValid = USER_REGEX.test(username);
    const emailValid = EMAIL_REGEX.test(email);
    const passwordValid = PWD_REGEX.test(password);
    const passwordsMatch = password === confirmPassword;

    setErrors({
      username: usernameValid ? "" : "Invalid username.",
      email: emailValid ? "" : "Invalid email.",
      password: passwordValid ? "" : "Invalid password.",
      confirmPassword: passwordsMatch ? "" : "Passwords do not match.",
    });

    return usernameValid && emailValid && passwordValid && passwordsMatch;
  }

  return (
    <div>
      {!isSuccessfull && !isUnsuccessfull ? (
        <form className={styles.regForm} onSubmit={handleFormSubmit}>
          <p>User registration form</p>
          <hr />
          <label>
            Username:
            <input
              type="text"
              value={data.username}
              onChange={(e) => handleInputChange(e, "username")}
              required
            />
            {errors.username && (
              <div className={styles.error}>{errors.username}</div>
            )}
          </label>
          <label>
            Email:
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange(e, "email")}
              required
            />
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </label>
          <label>
            Password:
            <input
              type="password"
              value={data.password}
              onChange={(e) => handleInputChange(e, "password")}
              autoComplete="off"
              required
            />
            {errors.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
          </label>
          <label>
            Confirm password:
            <input
              type="password"
              value={data.confirmPassword}
              onChange={(e) => handleInputChange(e, "confirmPassword")}
              autoComplete="off"
              required
            />
            {errors.confirmPassword && (
              <div className={styles.error}>{errors.confirmPassword}</div>
            )}
          </label>
          {!isPending && <button>Register</button>}
          {isPending && <div className={styles.loader}></div>}
        </form>
      ) : isSuccessfull ? (
        <div className={styles.succesMessage}>
          New user successfully added!
          <img src="./dancing-cat.gif" alt="" width={100} />
        </div>
      ) : (
        <div className={styles.errorMessage}>
          Error appeared, restart page :(
          <img src="./sad-cat.gif" alt="sad cat gif" width={200} />
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
