import styled from 'styled-components';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HelpIcon from '@mui/icons-material/Help';
import { theme } from '../../theme';
import Button from '../../components/Button';

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${theme.colors.surfaceAlt};
    overflow: hidden;
`;

const Header = styled.div`
    background: ${theme.colors.primary};
    color: white;
    padding: 24px;
    box-shadow: ${theme.shadows.md};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const Title = styled.h1`
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: white;
`;

const Content = styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
`;

const Card = styled.div`
    background: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.xl};
    padding: 40px;
    box-shadow: ${theme.shadows.md};
    text-align: center;
    max-width: 500px;
    width: 100%;
`;

const IconWrapper = styled.div`
    margin-bottom: 24px;
`;

const ContentTitle = styled.h2`
    color: ${theme.colors.primary};
    font-size: 24px;
    margin: 0 0 12px 0;
    font-weight: 700;
`;

const ContentDescription = styled.p`
    color: ${theme.colors.textLight};
    font-size: 15px;
    line-height: 1.6;
    margin: 0 0 8px 0;
`;

const ComingSoon = styled.p`
    color: ${theme.colors.textMuted};
    font-size: 14px;
    font-style: italic;
    margin: 16px 0 0 0;
`;

const Guide = () => {
    const navigate = useNavigate();

    return (
        <PageContainer>
            <Header>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={() => navigate('/')}
                >
                    <ArrowBackIcon fontSize="small" />
                    Back to Menu
                </Button>
                <Title>How To Guide</Title>
            </Header>

            <Content>
                <Card>
                    <IconWrapper>
                        <HelpIcon sx={{ fontSize: 64, color: theme.colors.primary }} />
                    </IconWrapper>
                    <ContentTitle>How To Guide</ContentTitle>
                    <ContentDescription>
                        Step-by-step guides and tutorials on how to use the inventory application effectively.
                    </ContentDescription>
                    <ComingSoon>Coming soon...</ComingSoon>
                </Card>
            </Content>
        </PageContainer>
    );
};

export default Guide;
