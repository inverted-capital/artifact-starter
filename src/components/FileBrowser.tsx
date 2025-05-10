import React, { useState, useEffect } from 'react';
import { useDir, useMeta, useString } from '@artifact/client';

type FileItemProps = {
  path: string;
  isFolder?: boolean;
  onClick: () => void;
  isSelected: boolean;
};

const FileItem: React.FC<FileItemProps> = ({ path, isFolder, onClick, isSelected }) => {
  const displayName = path.split('/').pop() || path;
  
  return (
    <div 
      onClick={onClick}
      className={`file-item ${isSelected ? 'selected' : ''}`}
      style={{
        padding: '8px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isSelected ? '#e0e0ff' : 'transparent',
        color: '#333',
        borderRadius: '4px',
        margin: '2px 0'
      }}
    >
      <span style={{ marginRight: '8px', fontSize: '18px' }}>
        {isFolder ? '📁' : '📄'}
      </span>
      <span>{displayName}{!isFolder && path.includes('.') ? '' : ' (folder)'}</span>
    </div>
  );
};

export const FileBrowser: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('.');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  // Get metadata for the current directory
  const meta = useMeta(currentPath);
  // Get directory contents for the current path
  const dirContents = useDir(currentPath);
  
  // Always call useString hook regardless of selectedFile state
  const fileContent = useString(selectedFile || '');

  // Navigate up one directory level
  const navigateUp = () => {
    if (currentPath === '.') return;
    
    const pathParts = currentPath.split('/');
    pathParts.pop();
    const newPath = pathParts.length === 0 ? '.' : pathParts.join('/');
    setCurrentPath(newPath);
    setSelectedFile(null);
  };

  // Handle clicking on a directory item
  const handleItemClick = (item: { path: string; mode: number }) => {
    const isDirectory = (item.mode & 0o040000) !== 0;
    const fullPath = currentPath === '.' ? item.path : `${currentPath}/${item.path}`;
    
    if (isDirectory) {
      setCurrentPath(fullPath);
      setSelectedFile(null);
    } else {
      setSelectedFile(fullPath);
    }
  };

  // Check if we have successful metadata
  const isLoaded = Boolean(meta?.commit);

  if (!isLoaded) {
    return (
      <div className="file-browser-container" style={{ padding: '16px' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading repository data...
        </div>
      </div>
    );
  }

  return (
    <div className="file-browser-container" style={{ 
      display: 'flex', 
      height: '70vh',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#f9f9f9'
    }}>
      <div className="file-list" style={{ 
        width: '300px', 
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        padding: '8px'
      }}>
        <div style={{ padding: '8px', borderBottom: '1px solid #ddd', marginBottom: '8px' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>artifact-soul branch</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={navigateUp}
              disabled={currentPath === '.'}
              style={{
                padding: '4px 8px',
                cursor: currentPath === '.' ? 'default' : 'pointer',
                backgroundColor: '#646cff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                opacity: currentPath === '.' ? 0.5 : 1
              }}
            >
              ⬆️ Up
            </button>
            <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
              /{currentPath === '.' ? '' : currentPath}
            </span>
          </div>
        </div>
        
        {dirContents && dirContents.length > 0 ? (
          dirContents.map((item) => {
            const isDirectory = (item.mode & 0o040000) !== 0;
            const fullPath = currentPath === '.' ? item.path : `${currentPath}/${item.path}`;
            return (
              <FileItem 
                key={item.path}
                path={item.path}
                isFolder={isDirectory}
                onClick={() => handleItemClick(item)}
                isSelected={selectedFile === fullPath}
              />
            );
          })
        ) : (
          <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
            {dirContents ? 'Empty directory' : 'Loading directory contents...'}
          </div>
        )}
      </div>
      
      <div className="file-content" style={{ 
        flex: 1, 
        padding: '16px',
        overflowY: 'auto',
        backgroundColor: 'white'
      }}>
        {selectedFile ? (
          <>
            <h3 style={{ 
              borderBottom: '1px solid #eee', 
              paddingBottom: '8px',
              textAlign: 'left' 
            }}>
              {selectedFile.split('/').pop()}
            </h3>
            <pre style={{
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: '14px',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              color: '#333',
              textAlign: 'left'
            }}>
              {fileContent || 'Loading content...'}
            </pre>
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#666'
          }}>
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>📁</span>
            <p>Select a file to view its contents</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileBrowser;