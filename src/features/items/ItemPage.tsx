<<<<<<< HEAD
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../db/db';
import type { IItem, DamageLevelType } from '../../db/items';

const ItemPage = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [item, setItem] = useState<IItem | null>(null);
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Fetch the item from Dexie by ID
    useEffect(() => {
        const fetchItem = async () => {
            if (!itemId) return;
            const dbItem = await db.items.get(itemId);
            if (dbItem) {
                setItem(dbItem);
                setText(dbItem.remark || '-No additional information.');
            }
        };
        fetchItem();
    }, [itemId]);

    // Auto-grow textarea
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
=======
import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import BSchlauch from '../../assets/B-Schlauch.jpg';

const contentWidth = '400px'; // uniform width for all components

const PageContainer = styled.div`
    padding: 20px;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
`;

const Title = styled.h1`
    margin-bottom: 5px;
`;

const Subtitle = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
`;

const Image = styled.img`
    width: ${contentWidth};
    height: auto;
    display: block;
    margin: 20px 0;
    border-radius: 8px;
`;

const ColumnsContainer = styled.div`
    display: flex;
    width: ${contentWidth};
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    gap: 20px;
    margin-bottom: 20px;
`;

const Column = styled.div`
    flex: 1;
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const TextBox = styled.textarea`
    width: ${contentWidth};
    min-height: 60px;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    display: block;
    margin-bottom: 20px;
    resize: none;
    overflow: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const Button = styled.button`
    width: ${contentWidth};
    padding: 10px 0;
    font-size: 16px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

const handleAdditionalDocs = () => {
    alert('Additional Docs clicked!');
};

const ItemPage = () => {
    const itemReference = 'Item Ref: B-12345'; // Example reference

    const leftColumnText = `Maintenance Stat:
Good`;

    const rightColumnText = `Location:
3B`;

    const [text, setText] = useState(`-Here is some detailed information of the selected Item.
-This is the second line of information.
-And this is the third line.`);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-grow textarea height dynamically
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // reset height
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; // adjust to content
>>>>>>> origin/4-item-list-overview
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [text]);

<<<<<<< HEAD
    const handleAdditionalDocs = () => {
        alert('Additional Docs clicked!');
    };

    if (!item) return <p className="text-center mt-4">Loading item...</p>;

    const itemReference = `Item Ref: ${item.inventoryNumber || item.id}`;

    // Helper to capitalize damage level
    const formatDamageLevel = (level: DamageLevelType) => level.charAt(0).toUpperCase() + level.slice(1);

    return (
        <div className="container py-4">
            <h1 className="mb-1">{item.name}</h1>
            <div className="text-muted mb-4">{itemReference}</div>
            {/* Two-column info */}
            <div className="row mb-4 border rounded p-3">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <p>
                        <strong>Maintenance Stat:</strong> {formatDamageLevel(item.damageLevel)}
                    </p>
                    <p>
                        <strong>Device Number:</strong> {item.deviceNumber || '-'}
                    </p>
                    <p>
                        <strong>Is Set:</strong> {item.isSet ? 'Yes' : 'No'}
                    </p>
                    <p>
                        <strong>Amount Target:</strong> {item.amountTarget}
                    </p>
                    <p>
                        <strong>Amount Actual:</strong> {item.amountActual}
                    </p>
                    <p>
                        <strong>Availability:</strong> {item.availability}
                    </p>
                </div>
                <div className="col-12 col-md-6">
                    <p>
                        <strong>Location:</strong> {item.location}
                    </p>
                    <p>
                        <strong>Level:</strong> {item.level}
                    </p>
                    <p>
                        <strong>Last Inspection:</strong> {item.lastInspection || '-'}
                    </p>
                    <p>
                        <strong>Inspection Interval (months):</strong> {item.inspectionIntervalMonths || '-'}
                    </p>
                    <p>
                        <strong>Remark:</strong> {item.remark || '-'}
                    </p>
                </div>
            </div>
            {/* Remark / detail textarea */}
            <textarea
                ref={textareaRef}
                className="form-control mb-3"
                value={text}
                readOnly
                rows={3}
                style={{ overflow: 'hidden', resize: 'none' }}
                onChange={(e) => setText(e.target.value)}
            />
            {/*<button className="btn btn-primary w-100" onClick={handleAdditionalDocs}>
                Additional Docs
            </button>*/}{' '}
            {/*this is for later if we get to add files such as guides and documents from items*/}
        </div>
=======
    return (
        <PageContainer>
            <Title>Item Page</Title>
            <Subtitle>{itemReference}</Subtitle>
            <Image src={BSchlauch} alt="Item Illustration" />
            <ColumnsContainer>
                <Column>{leftColumnText}</Column>
                <Column>{rightColumnText}</Column>
            </ColumnsContainer>
            <TextBox ref={textareaRef} value={text} readOnly onChange={(e) => setText(e.target.value)} />
            <Button onClick={handleAdditionalDocs}>Additional Docs</Button>
        </PageContainer>
>>>>>>> origin/4-item-list-overview
    );
};

export default ItemPage;
