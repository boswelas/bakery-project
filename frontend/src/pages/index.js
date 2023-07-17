import React, { useState, useEffect } from 'react';
import styles from '../styles/page.module.css'

const Home = () => {
  const [inventoryData, setInventoryData] = useState([]);


  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch(
          // 'http://localhost:5001/inventory', 
          'https://bakery-project-production.up.railway.app/inventory',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });

        const data = await response.json();
        if (data.inventory === 'invalid') {
          setInventoryData([]);
        } else {
          setInventoryData(data.inventory);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchInventoryData();
  }, []);



  return (
    <>

      <div>
        {inventoryData.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </>
  );
};

export default Home;
