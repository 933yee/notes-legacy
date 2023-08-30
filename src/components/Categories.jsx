import React, { useState, useEffect } from 'react';
import files from 'settings/files.js';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import './Categories.css';

function buildCategory(organizedData, categoryList, index, filename) {
    if (categoryList.length == index + 1) {
        if (!organizedData[categoryList[index]]) {
            organizedData[categoryList[index]] = [];
        }
        organizedData[categoryList[index]].push(filename);
    } else {
        if (!organizedData[categoryList[index]]) {
            organizedData[categoryList[index]] = {};
        }
        buildCategory(organizedData[categoryList[index]], categoryList, index + 1, filename);
    }

}

function displayCategory(organizedData, layer) {
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
            <div className={`category-layer${layer}`}>
                {
                    Object.keys(organizedData).map((item, index) => {
                        let folderIcon;
                        if (layer == 1) folderIcon = <i className="fa-regular fa-folder-open" style={{ paddingRight: '0.5rem' }}></i>;
                        else if (layer == 2) folderIcon = <i className="fa-regular fa-folder-closed" style={{ paddingRight: '0.5rem' }}></i>
                        else if (layer == 3) folderIcon = <i className="fa-regular fa-folder" style={{ paddingRight: '0.5rem' }}></i>;

                        return (
                            <div key={index}>
                                <div>
                                    {folderIcon}
                                    {item}
                                </div>
                                {displayCategory(organizedData[`${item}`], layer + 1)}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
{/* <i className="fa-regular fa-folder-open" style={{ paddingRight: '0.5rem' }}></i>
<i className="fa-regular fa-folder-closed" style={{ paddingRight: '0.5rem' }}></i>
<i className="fa-regular fa-folder" style={{ paddingRight: '0.5rem' }}></i> */}

function Categories() {
    const getOrganizedData = () => {
        const organizedData = {};
        Object.keys(files).map(filename => {
            const entry = files[filename];
            const category = entry.category;
            buildCategory(organizedData, category.split(', '), 0, filename);

        })
        console.log(organizedData)

        // console.log(displayCategory(organizedData, 0))
        return (
            displayCategory(organizedData, 1)
        )
    }
    return (
        <div className='categories-container'>
            {getOrganizedData()}
        </div>
    )
}

export default Categories;
