import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'



const InventoryDetail = () => {
    const router = useRouter();
    const { id, name } = router.query;
    const [inventoryData, setInventoryData] = useState([]);


    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5001/inventoryItem',
                    // 'https://bakery-project-production.up.railway.app/inventory',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: id
                        })
                    });

                const data = await response.json();
                setInventoryData(data.item[0]);
            } catch (error) {
                console.error(error);
            }
        };

        fetchInventoryData();
    }, []);


    return (
        <div>
            <h3>
                {name}
            </h3>
            <p>{inventoryData.description}</p>
            <p>{inventoryData.price}</p>
            <Image
                src={inventoryData.image}
                width={400}
                height={400}
                alt=""
            />
        </div>
    )
};

export default InventoryDetail;