// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import React from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import InventoryCard from "./InventoryCard";


function InventoryGrid({ data }) {
    const inventoryItems = data.map((cardData) => (
        <div key={cardData.id}>
            <InventoryCard props={cardData} />
        </div>
    ));

    return (

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {inventoryItems.map((item, index) => (
                <Grid xs={6} key={index}>
                    {item}
                </Grid>
            ))}
        </Grid>

    );
}

export default InventoryGrid;
