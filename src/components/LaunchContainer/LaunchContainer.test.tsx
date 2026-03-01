import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import LaunchContainer from './LaunchContainer';

// Мок данных для тестов
const mockLaunches = [
    {
        mission_name: 'Starlink 2',
        rocket: { rocket_name: 'Falcon 9' },
        links: {
            mission_patch_small: 'patch-small.jpg',
            mission_patch: 'patch-large.jpg'
        },
        details: 'Test details for Starlink 2',
    },
    {
        mission_name: 'Crew Dragon',
        rocket: { rocket_name: 'Falcon 9' },
        links: {
            mission_patch_small: 'dragon-small.jpg',
            mission_patch: 'dragon-large.jpg'
        },
        details: 'Test details for Crew Dragon',
    }
];

// Компонент-обертка с MantineProvider
const renderWithMantine = (component: React.ReactElement) => {
    return render(
        <MantineProvider>
            {component}
        </MantineProvider>
    );
};

describe('LaunchContainer', () => {
    beforeEach(() => {
        // Сбрасываем все моки перед каждым тестом
        vi.resetAllMocks();

        // Добавляем modal-root если его нет
        if (!document.getElementById('modal-root')) {
            const modalRoot = document.createElement('div');
            modalRoot.setAttribute('id', 'modal-root');
            document.body.appendChild(modalRoot);
        }
    });

    it('отображает состояние загрузки', () => {
        renderWithMantine(<LaunchContainer />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('отображает список запусков после загрузки', async () => {
        // Мокаем успешный ответ
        window.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve(mockLaunches),
            ok: true,
            status: 200,
        } as Response);

        renderWithMantine(<LaunchContainer />);

        // Ждем появления данных
        await waitFor(() => {
            expect(screen.getByText('Starlink 2')).toBeInTheDocument();
        });

        // Проверяем, что оба запуска отображаются
        expect(screen.getByText('Starlink 2')).toBeInTheDocument();
        expect(screen.getByText('Crew Dragon')).toBeInTheDocument();

        // Проверяем, что загрузка исчезла
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('открывает модальное окно при клике на See more', async () => {
        // Мокаем успешный ответ
        window.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve(mockLaunches),
            ok: true,
            status: 200,
        } as Response);

        const user = userEvent.setup();
        renderWithMantine(<LaunchContainer />);

        // Ждем загрузки данных
        await waitFor(() => {
            expect(screen.getByText('Starlink 2')).toBeInTheDocument();
        });

        // Находим первую кнопку See more и кликаем
        const seeMoreButtons = screen.getAllByText('See more');
        await user.click(seeMoreButtons[0]);

        // Находим модальное окно
        await waitFor(() => {
            const modalOverlay = document.querySelector('[style*="rgba(0, 0, 0, 0.5)"]');
            expect(modalOverlay).toBeInTheDocument();
        });

        const modalOverlay = document.querySelector('[style*="rgba(0, 0, 0, 0.5)"]');
        const modal = within(modalOverlay as HTMLElement);

        // Проверяем элементы внутри модального окна
        expect(modal.getByRole('heading', {
            name: 'Starlink 2',
            level: 2
        })).toBeInTheDocument();

        expect(modal.getByText('Test details for Starlink 2')).toBeInTheDocument();

        // Ищем Rocket и Falcon 9 отдельно
        expect(modal.getByText('Rocket:')).toBeInTheDocument();
        expect(modal.getByText('Falcon 9')).toBeInTheDocument();

        // Или ищем по более простому паттерну
        const rocketText = modal.getByText(/Rocket:/);
        expect(rocketText).toBeInTheDocument();

        const rocketName = modal.getByText('Falcon 9');
        expect(rocketName).toBeInTheDocument();
    });

    it('закрывает модальное окно при клике на кнопку закрытия', async () => {
        // Мокаем успешный ответ
        window.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve(mockLaunches),
            ok: true,
            status: 200,
        } as Response);

        const user = userEvent.setup();
        renderWithMantine(<LaunchContainer />);

        // Ждем загрузки данных
        await waitFor(() => {
            expect(screen.getByText('Starlink 2')).toBeInTheDocument();
        });

        // Открываем модальное окно
        const seeMoreButtons = screen.getAllByText('See more');
        await user.click(seeMoreButtons[0]);

        // Проверяем, что модальное окно открылось
        await waitFor(() => {
            expect(screen.getByText((content) =>
                content.includes('Test details for Starlink 2')
            )).toBeInTheDocument();
        });

        // Находим и кликаем кнопку закрытия (×)
        const closeButton = screen.getByText('×');
        await user.click(closeButton);

        // Проверяем, что модальное окно закрылось
        await waitFor(() => {
            expect(screen.queryByText((content) =>
                content.includes('Test details for Starlink 2')
            )).not.toBeInTheDocument();
        });
    });

    it('закрывает модальное окно при клике на фон', async () => {
        // Мокаем успешный ответ
        window.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve(mockLaunches),
            ok: true,
            status: 200,
        } as Response);

        const user = userEvent.setup();
        renderWithMantine(<LaunchContainer />);

        // Ждем загрузки данных
        await waitFor(() => {
            expect(screen.getByText('Starlink 2')).toBeInTheDocument();
        });

        // Открываем модальное окно
        const seeMoreButtons = screen.getAllByText('See more');
        await user.click(seeMoreButtons[0]);

        // Проверяем, что модальное окно открылось
        await waitFor(() => {
            expect(screen.getByText((content) =>
                content.includes('Test details for Starlink 2')
            )).toBeInTheDocument();
        });

        // Кликаем на фон (оверлей)
        const overlay = document.querySelector('[style*="rgba(0, 0, 0, 0.5)"]');
        await user.click(overlay!);

        // Проверяем, что модальное окно закрылось
        await waitFor(() => {
            expect(screen.queryByText((content) =>
                content.includes('Test details for Starlink 2')
            )).not.toBeInTheDocument();
        });
    });

    it('закрывает модальное окно при нажатии Escape', async () => {
        // Мокаем успешный ответ
        window.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve(mockLaunches),
            ok: true,
            status: 200,
        } as Response);

        const user = userEvent.setup();
        renderWithMantine(<LaunchContainer />);

        // Ждем загрузки данных
        await waitFor(() => {
            expect(screen.getByText('Starlink 2')).toBeInTheDocument();
        });

        // Открываем модальное окно
        const seeMoreButtons = screen.getAllByText('See more');
        await user.click(seeMoreButtons[0]);

        // Проверяем, что модальное окно открылось
        await waitFor(() => {
            expect(screen.getByText((content) =>
                content.includes('Test details for Starlink 2')
            )).toBeInTheDocument();
        });

        // Нажимаем Escape
        await user.keyboard('{Escape}');

        // Проверяем, что модальное окно закрылось
        await waitFor(() => {
            expect(screen.queryByText((content) =>
                content.includes('Test details for Starlink 2')
            )).not.toBeInTheDocument();
        });
    });

    it('отображает ошибку при неудачной загрузке', async () => {
        // Мокаем ошибку fetch
        window.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        renderWithMantine(<LaunchContainer />);

        await waitFor(() => {
            expect(screen.getByText(/Error:/i)).toBeInTheDocument();
        });

        // Проверяем, что список не отображается
        expect(screen.queryByText('Starlink 2')).not.toBeInTheDocument();
    });

    it('отображает разные миссии в модальных окнах', async () => {
        // Мокаем успешный ответ
        window.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve(mockLaunches),
            ok: true,
            status: 200,
        } as Response);

        const user = userEvent.setup();
        renderWithMantine(<LaunchContainer />);

        // Ждем загрузки данных
        await waitFor(() => {
            expect(screen.getByText('Starlink 2')).toBeInTheDocument();
        });

        // Кликаем на первую миссию
        const seeMoreButtons = screen.getAllByText('See more');
        await user.click(seeMoreButtons[0]);

        // Проверяем детали первой миссии
        await waitFor(() => {
            expect(screen.getByText((content) =>
                content.includes('Test details for Starlink 2')
            )).toBeInTheDocument();
        });

        // Закрываем модальное окно
        const closeButton = screen.getByText('×');
        await user.click(closeButton);

        // Кликаем на вторую миссию
        await user.click(seeMoreButtons[1]);

        // Проверяем детали второй миссии
        await waitFor(() => {
            expect(screen.getByText((content) =>
                content.includes('Test details for Crew Dragon')
            )).toBeInTheDocument();
        });
    });
});