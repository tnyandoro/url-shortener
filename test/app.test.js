import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App'; 

jest.mock('axios');

describe('index', () => {

    // Renders the URL Manager page with a table of URLs and pagination
    it('should render the URL Manager page with a table of URLs and pagination', () => {
        jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
        jest.spyOn(React, 'useEffect').mockImplementation((callback) => callback());
        const mockGet = jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: [], page: 0, size: 0 } });
        render(<index />);
        expect(mockGet).toHaveBeenCalledWith('/urls?page=0&size=10');
        expect(screen.getByText('URL Manager')).toBeInTheDocument();
        expect(screen.getByText('Add URL')).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    // Displays an error message when failing to submit a new URL to the server
    it('should display an error message when failing to submit a new URL to the server', async () => {
        jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
        jest.spyOn(React, 'useEffect').mockImplementation((callback) => callback());
        const mockGet = jest.spyOn(axios, 'get').mockRejectedValue(new Error('Failed to fetch URLs'));
        render(<App />);
        expect(mockGet).toHaveBeenCalledWith('/urls?page=0&size=10');
        await waitFor(() => {
            expect(screen.getByText('Error fetching URLs:')).toBeInTheDocument();
        });
    });

    // Displays an error message when failing to fetch URLs
    it('should display an error message when failing to fetch URLs', async () => {
        jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
        jest.spyOn(React, 'useEffect').mockImplementation((callback) => callback());
        const mockGet = jest.spyOn(axios, 'get').mockRejectedValue(new Error('Failed to fetch URLs'));
        render(<App />);
        expect(mockGet).toHaveBeenCalledWith('/urls?page=0&size=10');
        await waitFor(() => {
            expect(screen.getByText('Error fetching URLs:')).toBeInTheDocument();
        });
    });

    // Adds a new URL to the list
    it('should add a new URL to the list', async () => {
        jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
        jest.spyOn(React, 'useEffect').mockImplementation((callback) => callback());
        const mockGet = jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: [], page: 0, size: 0 } });
        const mockPost = jest.spyOn(axios, 'post').mockResolvedValue();
        render(<App />);
        await waitFor(() => {
            expect(screen.getByText('URL Manager')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('Add URL'));
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test URL' } });
        fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://www.testurl.com' } });
        fireEvent.click(screen.getByText('Add URL'));
        expect(mockPost).toHaveBeenCalledWith('/urls', { name: 'Test URL', url: 'https://www.testurl.com' });
        expect(mockGet).toHaveBeenCalledTimes(2);
    });

    // Edits an existing URL in the list
    it('should edit an existing URL in the list', async () => {
        jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
        jest.spyOn(React, 'useEffect').mockImplementation((callback) => callback());
        const mockGet = jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: [], page: 0, size: 0 } });
        const mockPut = jest.spyOn(axios, 'put').mockResolvedValue();
        render(<App />);
        await waitFor(() => {
            expect(screen.getByText('URL Manager')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('Add URL'));
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test URL' } });
        fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://www.testurl.com' } });
        fireEvent.click(screen.getByText('Add URL'));
        fireEvent.click(screen.getByText('Edit'));
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated URL' } });
        fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://www.updatedurl.com' } });
        fireEvent.click(screen.getByText('Save Changes'));
        expect(mockPut).toHaveBeenCalledWith('/urls/1', { name: 'Updated URL', url: 'https://www.updatedurl.com' });
        expect(mockGet).toHaveBeenCalledTimes(3);
    });

    // Deletes an existing URL from the list
    it('should delete an existing URL from the list', async () => {
        jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
        jest.spyOn(React, 'useEffect').mockImplementation((callback) => callback());
        const mockGet = jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: [], page: 0, size: 0 } });
        const mockDelete = jest.spyOn(axios, 'delete').mockResolvedValue();
        render(<App />);
        await waitFor(() => {
            expect(screen.getByText('URL Manager')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('Add URL'));
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test URL' } });
        fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://www.testurl.com' } });
        fireEvent.click(screen.getByText('Add URL'));
        fireEvent.click(screen.getByText('Delete'));
        expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this URL?');
        expect(mockDelete).toHaveBeenCalledWith('/urls/1');
        expect(mockGet).toHaveBeenCalledTimes(2);
    });
});
