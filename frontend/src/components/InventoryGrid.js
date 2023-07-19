// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import React from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import InventoryCard from "./InventoryCard";


function InventoryGrid({ data }) {
    const inventoryItems = data.map((cardData, index) => (
        <div key={index} >
            <InventoryCard props={cardData} />
        </div>
    ));

    return (
        <>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {inventoryItems.map((item => (
                    <Grid item xs={6}>
                        {item}
                    </Grid>
                )))}

            </Grid>
        </>
    )
};

export default InventoryGrid;