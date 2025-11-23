import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import PageHeader from '../../layout/PageHeader';


const contentWidth = '400px'; // uniform width for all components

const PageContainer = styled.div`
    padding: 20px;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100dvh;
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

const ItemDetails = () => {
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
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    return (
        <div>
            <PageHeader title="Item Details" />
            <Subtitle>{itemReference}</Subtitle>
            <ColumnsContainer>
                <Column>{leftColumnText}</Column>
                <Column>{rightColumnText}</Column>
            </ColumnsContainer>
            <TextBox ref={textareaRef} value={text} readOnly onChange={(e) => setText(e.target.value)} />
            <Button onClick={handleAdditionalDocs}>Additional Docs</Button>
        </div>
    );
};

export default ItemDetails;
