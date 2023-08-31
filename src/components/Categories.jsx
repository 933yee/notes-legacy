import React, { useState, useEffect } from 'react';
import files from 'settings/files.js';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import { AiFillFolderOpen } from "react-icons/ai";
import './Categories.css';

function buildCategory(organizedData, categoryList, index, filename) {
    if (categoryList.length == index + 1) {
        if (!organizedData[categoryList[index]]) {
            organizedData[categoryList[index]] = { 'files': [] }
        }
        organizedData[categoryList[index]]['files'].push(filename);
    } else {
        if (!organizedData[categoryList[index]]) {
            organizedData[categoryList[index]] = { 'files': [] };
        }
        buildCategory(organizedData[categoryList[index]], categoryList, index + 1, filename);
    }

}



function displayCategory(organizedData, layer, dropdownButtonStates, setDropdownButtonStates) {
    const handleCategoryFolderDropdwonButtonClick = (item) => {
        setDropdownButtonStates(prevState => ({
            ...prevState,
            [item]: !prevState[item]
        }));
    }
    if (Array.isArray(organizedData)) {
        return (
            <div className='filenames'>
                {organizedData.map((filename, index) => (
                    <div key={index}>
                        <a href={`http://localhost:7070/#/home/posts/${filename}`}>
                            {files[filename]['title']}
                        </a>
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                {
                    Object.keys(organizedData).map((item, index) => {
                        let folderIcon;
                        return (
                            <div key={index} className={`category-layer${layer}`}>
                                {item == 'files' ? '' :
                                    <div onClick={() => handleCategoryFolderDropdwonButtonClick(item)}>
                                        {<AiFillFolderOpen className="folder-icon"></AiFillFolderOpen>}
                                        {item}
                                    </div>}
                                {(item == 'files' || dropdownButtonStates[item]) && displayCategory(organizedData[item], layer + 1, dropdownButtonStates, setDropdownButtonStates)}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

function Categories() {
    const [dropdownButtonStates, setDropdownButtonStates] = useState({});
    const getOrganizedData = () => {
        const organizedData = {};
        Object.keys(files).map(filename => {
            const entry = files[filename];
            const category = entry.category;
            buildCategory(organizedData, category.split(', '), 0, filename);
        })
        useEffect(() => {
            const initialDropdownStates = {};
            Object.keys(organizedData).forEach(category => {
                initialDropdownStates[category] = false;
            });
            setDropdownButtonStates(initialDropdownStates);
        }, []);
        // console.log(organizedData)

        // console.log(displayCategory(organizedData, 0))
        return displayCategory(organizedData, 1, dropdownButtonStates, setDropdownButtonStates);
    }
    return (
        <div className='categories-container'>
            {getOrganizedData()}
        </div>
    )
}

export default Categories;
