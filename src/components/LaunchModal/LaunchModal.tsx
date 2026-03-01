import ReactDOM from 'react-dom';
import type { Launch } from '../../types/types.ts';
import { useEffect } from "react";

interface LaunchModalProps {
    opened: boolean;
    onClose: () => void;
    launch: Launch | null;
}

function LaunchModal({ opened, onClose, launch }: LaunchModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (opened) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => document.removeEventListener('keydown', handleEscape);
    }, [opened, onClose]);

    if (!opened || !launch) return null;


    const imageSrc = launch.links?.mission_patch
        ? launch.links.mission_patch
        : 'placeholder.jpg';

    return ReactDOM.createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                    position: 'relative',
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        border: 'none',
                        background: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        width: '30px',
                        height: '30px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    ×
                </button>

                <img
                    src={imageSrc}
                    alt={launch.mission_name}
                    style={{
                        maxWidth: '200px',
                        marginBottom: '20px',
                        display: 'block',
                        margin: '0 auto 20px'
                    }}
                />

                <h2 style={{ marginTop: 0 }}>{launch.mission_name}</h2>
                <p><strong>Rocket:</strong> {launch.rocket?.rocket_name}</p>
                <p><strong>Details:</strong> {launch.details || 'No details available'}</p>
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
}

export default LaunchModal;