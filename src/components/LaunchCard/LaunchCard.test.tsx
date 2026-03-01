import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import LaunchCard from './LaunchCard';

const mockLaunch = {
    mission_name: 'Starlink 2',
    rocket: { rocket_name: 'Falcon 9' },
    links: {
        mission_patch_small: 'test.jpg',
        mission_patch: 'test-large.jpg',
    },
    details: 'Test details'
};

const renderWithMantine = (component: React.ReactElement) => {
    return render(<MantineProvider>{component}</MantineProvider>);
};

describe('LaunchCard', () => {
    it('рендерит информацию о запуске', () => {
        renderWithMantine(<LaunchCard launch={mockLaunch} onSeeMore={() => {}} />);

        expect(screen.getByText('Starlink 2')).toBeInTheDocument();
        expect(screen.getByText('Rocket: Falcon 9')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'See more' })).toBeInTheDocument();
    });

    it('вызывает onSeeMore при клике', async () => {
        const user = userEvent.setup();
        const mockOnSeeMore = vi.fn();

        renderWithMantine(<LaunchCard launch={mockLaunch} onSeeMore={mockOnSeeMore} />);

        await user.click(screen.getByText('See more'));
        expect(mockOnSeeMore).toHaveBeenCalledWith(mockLaunch);
    });
});