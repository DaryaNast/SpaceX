import type { Launch } from "../../types/types.ts";
import { useReducer, useEffect, useState } from "react";
import { SimpleGrid } from "@mantine/core";
import LaunchCard from '../LaunchCard/LaunchCard.tsx'
import LaunchModal from "../LaunchModal/LaunchModal.tsx";

const initialState = {
    launches: [],
    isLoading: false,
    error: null,
}

type Action =
    | { type: 'FETCH_START'}
    | { type: 'FETCH_SUCCESS'; payload: Launch[] }
    | { type: 'FETCH_ERROR'; payload: string }

interface LaunchState {
    launches: Launch[];
    isLoading: boolean;
    error: string | null;
}


const reducer = (state: LaunchState, action: Action) => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            }
            case 'FETCH_SUCCESS':
                return {
                    ...state,
                    isLoading: false,
                    launches: action.payload,
                }
                case 'FETCH_ERROR':
                    return {
                        ...state,
                        isLoading: false,
                        error: action.payload,
                    }
                    default:
                        return state;
    }
}

function LaunchContainer() {
    const [state, dispatch] = useReducer(reducer, initialState)

    const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
    const [modalOpened, setModalOpened] = useState(false);

    const openModal = (launch: Launch) => {
        setSelectedLaunch(launch);
        setModalOpened(true);
    };

    const closeModal = () => {
        setModalOpened(false);
        setSelectedLaunch(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_START" });
            try {
                const resp = await fetch('https://api.spacexdata.com/v3/launches?launch_year=2020')
                const data = await resp.json();
                dispatch({ type: "FETCH_SUCCESS", payload: data });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                dispatch({ type: "FETCH_ERROR", payload: errorMessage });
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            {state.isLoading && <div>Loading...</div>}
            {state.error && <div>Error: {state.error}</div>}
            <SimpleGrid cols={3} spacing="md">
                {state.launches.map(launch => (
                    <LaunchCard
                        key={launch.mission_name}
                        launch={launch}
                        onSeeMore={openModal}
                    />
                ))}
            </SimpleGrid>
            <LaunchModal
                opened={modalOpened}
                onClose={closeModal}
                launch={selectedLaunch}
            />
        </div>
    )
}

export default LaunchContainer;