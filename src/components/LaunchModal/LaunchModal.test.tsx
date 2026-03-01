import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LaunchModal from './LaunchModal';

// Мок данных для тестов
const mockLaunch = {
    mission_name: 'Starlink 2',
    rocket: { rocket_name: 'Falcon 9' },
    links: {
        mission_patch_small: 'patch-small.jpg',
        mission_patch: 'patch-large.jpg'
    },
    details: 'Test details for Starlink 2',
};

// Создаем элемент modal-root перед каждым тестом
beforeEach(() => {
    // Добавляем modal-root в body, если его нет
    if (!document.getElementById('modal-root')) {
        const modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'modal-root');
        document.body.appendChild(modalRoot);
    }
});

describe('LaunchModal', () => {
    it('не рендерится, когда opened=false', () => {
        render(
            <LaunchModal
                opened={false}
                onClose={() => {}}
                launch={mockLaunch}
            />
        );

        expect(screen.queryByText('Starlink 2')).not.toBeInTheDocument();
    });

    it('не рендерится, когда launch=null', () => {
        render(
            <LaunchModal
                opened={true}
                onClose={() => {}}
                launch={null}
            />
        );

        expect(screen.queryByText('Starlink 2')).not.toBeInTheDocument();
    });

    it('отображает заглушку для details, если их нет', () => {
        const launchWithoutDetails = {
            ...mockLaunch,
            details: null
        };

        render(
            <LaunchModal
                opened={true}
                onClose={() => {}}
                launch={launchWithoutDetails}
            />
        );

        expect(screen.getByText('No details available')).toBeInTheDocument();
    });

    it('отображает изображение с правильным src', () => {
        render(
            <LaunchModal
                opened={true}
                onClose={() => {}}
                launch={mockLaunch}
            />
        );

        const image = screen.getByAltText('Starlink 2') as HTMLImageElement;
        expect(image.src).toContain('patch-large.jpg');
    });

    it('отображает заглушку для изображения, если его нет', () => {
        const launchWithoutImage = {
            ...mockLaunch,
            links: {
                mission_patch_small: null,
                mission_patch: null
            }
        };

        render(
            <LaunchModal
                opened={true}
                onClose={() => {}}
                launch={launchWithoutImage}
            />
        );

        const image = screen.getByAltText('Starlink 2') as HTMLImageElement;
        expect(image.src).toContain('placeholder.jpg');
    });

    it('вызывает onClose при клике на кнопку закрытия', async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        render(
            <LaunchModal
                opened={true}
                onClose={mockOnClose}
                launch={mockLaunch}
            />
        );

        const closeButton = screen.getByText('×');
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('вызывает onClose при клике на фон', async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        render(
            <LaunchModal
                opened={true}
                onClose={mockOnClose}
                launch={mockLaunch}
            />
        );

        // Находим элемент с фоном (оверлей)
        const overlay = document.querySelector('[style*="rgba(0, 0, 0, 0.5)"]');
        await user.click(overlay!);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('не вызывает onClose при клике на содержимое модального окна', async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        render(
            <LaunchModal
                opened={true}
                onClose={mockOnClose}
                launch={mockLaunch}
            />
        );

        // Находим содержимое модального окна (белый блок)
        const modalContent = screen.getByText('Starlink 2').closest('div[style*="background-color: white"]');
        expect(modalContent).toBeInTheDocument();

        await user.click(modalContent!);

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('вызывает onClose при нажатии Escape', async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        render(
            <LaunchModal
                opened={true}
                onClose={mockOnClose}
                launch={mockLaunch}
            />
        );

        await user.keyboard('{Escape}');

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('не вызывает onClose при нажатии других клавиш', async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        render(
            <LaunchModal
                opened={true}
                onClose={mockOnClose}
                launch={mockLaunch}
            />
        );

        await user.keyboard('{Enter}');
        await user.keyboard('a');
        await user.keyboard('{Tab}');

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('удаляет обработчик Escape при закрытии', () => {
        const mockOnClose = vi.fn();

        const { unmount } = render(
            <LaunchModal
                opened={true}
                onClose={mockOnClose}
                launch={mockLaunch}
            />
        );

        // Добавляем spy на removeEventListener
        const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('рендерится в portal (в элемент с id="modal-root")', () => {
        render(
            <LaunchModal
                opened={true}
                onClose={() => {}}
                launch={mockLaunch}
            />
        );

        const modalRoot = document.getElementById('modal-root');
        expect(modalRoot).toBeInTheDocument();
        expect(modalRoot?.children.length).toBeGreaterThan(0);
    });
});