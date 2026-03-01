import { Card, Button, Text } from '@mantine/core';
import type { Launch } from '../../types/types';

interface LaunchCardProps {
    launch: Launch;
    onSeeMore: (launch: Launch) => void;
}

function LaunchCard({ launch, onSeeMore }: LaunchCardProps) {
    return (
        <Card shadow="sm" padding="md" radius="md" withBorder>
            <Card.Section>
                <img
                    src={launch.links?.mission_patch_small || 'placeholder.jpg'}
                    alt={launch.mission_name}
                    style={{ width: '100px', height: '100px' }}
                />
            </Card.Section>

            <Text size="lg" fw={500} mt="md">
                {launch.mission_name}
            </Text>

            <Text size="sm" c="dimmed">
                Rocket: {launch.rocket?.rocket_name}
            </Text>

            <Button
                onClick={() => onSeeMore(launch)}
                variant='filled'
                color="blue"
                fullWidth
                mt="md"
            >
                See more
            </Button>
        </Card>
    );
}

export default LaunchCard;