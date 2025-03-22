import styled from "styled-components";

const LoadingSpinner = ({ message = "Cargando..." }) => {
    return (
        <SpinnerWrapper>
            <Spinner />
            <SpinnerText>{message}</SpinnerText>
        </SpinnerWrapper>
    );
};

export default LoadingSpinner;

const SpinnerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    text-align: center;
`;

const Spinner = styled.div`
    width: 60px;
    height: 60px;
    border: 6px solid #ccc;
    border-top-color: #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 480px) {
        width: 40px;
        height: 40px;
    }
`;

const SpinnerText = styled.p`
    margin-top: 15px;
    font-size: 1.2rem;
    color: #333;

    @media (max-width: 480px) {
        font-size: 1rem;
    }
`;
