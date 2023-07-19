import { styles } from "@/styles/inventory.module.css";
import Image from 'next/image'
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';




const InventoryCard = ({ props }) => {
    const id = props.id;
    const name = props.name;
    const price = props.price;
    const description = props.description;
    const image = props.image;
    const router = useRouter();

    const viewDetails = () => {
        router.push(`/menu/${id}?name=${encodeURIComponent(
            name)}`)
    }

    return (
        <>
            <div className="styles.Card">
                <div>{name}</div>
                <div>{price}</div>
                <Image
                    src={image}
                    width={200}
                    height={200}
                    alt=""
                />
                <p><Button onClick={viewDetails} >View More</Button></p>
            </div>
        </>

    )
};

export default InventoryCard;