import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/Button';

describe('Simple Component Test', () => {
  test('Button renders correctly', () => {
    render(<Button> Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});