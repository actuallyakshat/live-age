import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { RotateCcw } from "lucide-react";

interface User {
  name: string;
  dob: string;
}

interface UserData {
  user: User;
}

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  if (!userData) {
    return <Onboarding />;
  } else {
    return <LiveAge user={userData} />;
  }
}

function Onboarding() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState<string>(new Date().toISOString().slice(0, 10));
  const dateInput = useRef<HTMLInputElement>(null);

  const validateDate = (dateString: string): boolean => {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 130,
      today.getMonth(),
      today.getDate()
    );

    if (isNaN(selectedDate.getTime())) {
      alert("Please enter a valid date");
      return false;
    }

    if (selectedDate > today) {
      alert("Date cannot be in the future");
      return false;
    }

    if (selectedDate < minDate) {
      alert("Date cannot be older than 130 years");
      return false;
    }

    return true;
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim() === "") {
      alert("Please enter your name");
      return;
    }

    // Validate the date before submitting
    if (!validateDate(dob)) {
      return;
    }

    const userData: UserData = { user: { name, dob } };
    localStorage.setItem("user", JSON.stringify(userData));
    window.location.reload();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDob(e.target.value);
  };

  return (
    <div className="container onboarding">
      <div>
        <h2>Hey there!</h2>
        <p>Tell us about yourself</p>
      </div>

      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          value={dob}
          onChange={handleDateChange}
          ref={dateInput}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function LiveAge({ user }: { user: UserData }) {
  const [age, setAge] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    const calculateAge = (): number => {
      const birthDate = new Date(user.user.dob);
      const now = new Date();
      const ageInMs = now.getTime() - birthDate.getTime();
      const ageInYears = ageInMs / (365.25 * 24 * 60 * 60 * 1000);
      return ageInYears;
    };

    const updateAge = () => {
      setAge(calculateAge());
    };

    updateAge();
    const intervalId = setInterval(updateAge, 500);

    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <div className="container live-age">
      <h2>Hey {user.user.name.split(" ")[0]}! You are</h2>
      <h1>
        {age.toFixed(10)} <span>years old</span>
      </h1>
      <ResetButton />
    </div>
  );
}

function ResetButton() {
  function resetUser() {
    localStorage.removeItem("user");
    window.location.reload();
  }

  return (
    <button onClick={resetUser}>
      <RotateCcw />
    </button>
  );
}

export default App;
