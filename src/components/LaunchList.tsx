import { Card, Button, Text } from '@mantine/core';
import type { Launch } from '../types/types';  // добавь type для импорта типа

interface LaunchCardProps {
    launch: Launch;
    onSeeMore: (launch: Launch) => void;
}

function LaunchCard({ launch, onSeeMore }: LaunchCardProps) {
    const imageSrc = launch.links?.mission_patch_small || 'https://via.placeholder.com/150?text=No+Image';

    return (
        <Card shadow="sm" padding="md" radius="md" withBorder>
            <Card.Section>
                <img
                    src={imageSrc}
                    alt={launch.mission_name}
                    style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'contain',
                        padding: '20px',
                        backgroundColor: '#f8f9fa'
                    }}
                />
            </Card.Section>

            <Text size="lg" fw={500} mt="md" lineClamp={2}>
                {launch.mission_name}
            </Text>

            <Text size="sm" c="dimmed" mt="xs">
                Rocket: {launch.rocket?.rocket_name || 'Unknown'}
            </Text>

            <Button
                onClick={() => onSeeMore(launch)}
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
            >
                See more
            </Button>
        </Card>
    );
}

export default LaunchCard;