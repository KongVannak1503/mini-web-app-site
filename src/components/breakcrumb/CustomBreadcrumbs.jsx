import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const CustomBreadcrumb = ({ items }) => {
    const navigate = useNavigate();

    return (
        <Breadcrumbs
            separator={<span className="!text-gray-700 !dark:text-gray-400 !font-semibold">/</span>}
            aria-label="breadcrumb"
        >
            {items.map(({ breadcrumbName, path }, index) => {
                const isClickable = !!path;
                if (isClickable) {
                    return (
                        <span
                            key={index}
                            className="!font-medium !text-gray-800 !dark:text-gray-400 !hover:text-black !dark:hover:text-white/90 !cursor-pointer"
                            onClick={() => navigate(path)}
                            role="link"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') navigate(path); }}
                        >
                            {breadcrumbName}
                        </span>
                    );
                } else {
                    return (
                        <Typography
                            key={index}
                            className="!text-gray-600 !dark:text-gray-300"
                            aria-current="page"
                        >
                            {breadcrumbName}
                        </Typography>
                    );
                }
            })}
        </Breadcrumbs>
    );
};

export default CustomBreadcrumb;
