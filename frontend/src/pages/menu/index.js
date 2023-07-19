import React, { useState, useEffect } from 'react';
import InventoryGrid from "@/components/InventoryGrid";

const Menu = () => {
    const [inventoryData, setInventoryData] = useState([]);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5001/inventory',
                    // 'https://bakery-project-production.up.railway.app/inventory',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
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
        <div>
            <h1>Eat Cookies.</h1>
            <div>
                <InventoryGrid data={inventoryData} />
            </div>
        </div>
    );
}

export default Menu;
