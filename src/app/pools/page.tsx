"use client";
import { useState, useEffect } from "react";

const ClientComponent = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/pools");
        const data = await response.json();
        if (response.ok) {
          setData(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const { banksShaped, userAccountsShaped } = data;

  return (
    <div>
      <h2>Banks</h2>
      {banksShaped.map((bank, index) => (
        <div key={index}>
          <pre>{JSON.stringify(bank, null, 2)}</pre>
        </div>
      ))}

      <h2>User Accounts</h2>
      {userAccountsShaped.map((account, index) => (
        <div key={index}>
          <pre>{JSON.stringify(account, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default ClientComponent;
