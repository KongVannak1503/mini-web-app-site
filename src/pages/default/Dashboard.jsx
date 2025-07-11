import { Card, TextField } from '@mui/material'
import { useState } from 'react';
import { useEffect } from 'react';
import { getProductsCountApi } from '../../services/productApi';
import { getCategoriesCountApi } from '../../services/categoryApi';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
    const { identity } = useAuth();
    const [productsCount, setProductsCount] = useState([]);
    const [categoriesCount, setCategoriesCount] = useState([]);
    useEffect(() => {
        document.title = 'Products';
        const fetchCount = async () => {
            try {
                const resProduct = await getProductsCountApi();
                setProductsCount(resProduct.data);

                const resCategories = await getCategoriesCountApi();
                setCategoriesCount(resCategories.data);


            } catch (error) {
                console.error('Failed to load products', error);
            }
        };
        fetchCount();
    }, []);
    return (
        <>
            <div className="grid grid-cols-5 gap-4">
                <Card className='p-4'>
                    <h5 className='text-lg font-bold mb-3'>Products</h5>
                    <h4 className="text-xl font-bold">{productsCount}</h4>
                </Card >
                <Card className="col-span-4 p-4">
                    <h5 className='text-lg font-bold mb-3'>Categories</h5>
                    <h4 className="text-xl font-bold">{categoriesCount}</h4>
                </Card>
            </div>
            <Card className="p-4 mt-7 min-h-60">
                <h5 className='text-2xl font-bold mb-3'>
                    Welcome to the Dashboard, {identity?.name}!
                </h5>
                <p>This is application's homepage.</p>
            </Card>
        </>
    )
}

export default Dashboard
