import { useMemo, useState, type ComponentType } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    ArrowDownAZ,
    ArrowDownNarrowWide,
    ChevronLeft,
    ClipboardList,
    FileUp,
    Image as ImageIcon,
    Info,
    ListChecks,
    MousePointerClick,
    Package,
    PlusCircle,
    Search,
} from 'lucide-react';

import { Card, Container } from '../../styles/components';
import { theme } from '../../styles/theme';

const FIND_ITEM_SCREENSHOT_SRC = '/guide/find-item.png';

type GuideTopicId = 'find-item' | 'add-item' | 'import-export' | 'packing-plans';

type GuideTopic = {
    id: GuideTopicId;
    title: string;
    description: string;
    icon: ComponentType<{ size?: number }>;
    available: boolean;
};

const Guide = () => {
    return (
        <Routes>
            <Route index element={<GuideListScreen />} />
            <Route path="find-item" element={<FindItemGuideScreen />} />
        </Routes>
    );
};

const GuideListScreen = () => {
    const navigate = useNavigate();

    const topics = useMemo<GuideTopic[]>(
        () => [
            {
                id: 'find-item',
                title: 'How to find an item',
                description: 'Search, filter, sort, and open item details.',
                icon: Package,
                available: true,
            },
            {
                id: 'add-item',
                title: 'How to add an item',
                description: 'Create a new inventory entry.',
                icon: PlusCircle,
                available: false,
            },
            {
                id: 'import-export',
                title: 'Import / export data',
                description: 'Back up your inventory and restore from Excel.',
                icon: FileUp,
                available: false,
            },
            {
                id: 'packing-plans',
                title: 'Packing plans',
                description: 'Select items, set quantities, and save plans.',
                icon: ClipboardList,
                available: false,
            },
        ],
        []
    );

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <IntroCard>
                    <IntroTitle>Guides</IntroTitle>
                    <IntroText>
                        Learn how to use the inventory app to manage items, organize packing plans, and work efficiently
                        during operations.
                    </IntroText>

                    <TopicGrid>
                        {topics.map((t) => {
                            const Icon = t.icon;
                            const onClick = () => {
                                if (!t.available) return;
                                if (t.id === 'find-item') navigate('find-item');
                            };

                            return (
                                <TopicButton
                                    key={t.id}
                                    type="button"
                                    onClick={onClick}
                                    disabled={!t.available}
                                    $available={t.available}
                                >
                                    <TopicHeader>
                                        <TopicIcon>
                                            <Icon size={18} />
                                        </TopicIcon>
                                        <TopicTitleRow>
                                            <TopicTitle>{t.title}</TopicTitle>
                                        </TopicTitleRow>
                                    </TopicHeader>
                                    <TopicDescription>{t.description}</TopicDescription>
                                    {!t.available && <TopicUnavailableHint>Guide not available yet</TopicUnavailableHint>}
                                </TopicButton>
                            );
                        })}
                    </TopicGrid>
                </IntroCard>
            </StyledContainer>
        </div>
    );
};

const FindItemGuideScreen = () => {
    const navigate = useNavigate();
    const [hasScreenshot, setHasScreenshot] = useState(true);

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={() => navigate('/guide')}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <IconPill>
                                <ListChecks size={16} />
                            </IconPill>
                            <span>How to find an item</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Use search, filters, and sorting to quickly locate an item, then click it to view details.
                        </TaskSubtitle>
                    </TaskHeader>

                    <TaskGrid>
                        <Steps>
                            <Step>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Open “Inventar”</StepTitle>
                                    <StepText>Use the sidebar navigation to open the inventory list.</StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <Search size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Search</StepTitle>
                                    <StepText>
                                        Type what you know (e.g., inventory number, name, ID) to narrow the list.
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <ArrowDownNarrowWide size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Filter</StepTitle>
                                    <StepText>
                                        Use filters (for example: damage level or location) to reduce results further.
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <ArrowDownAZ size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Sort</StepTitle>
                                    <StepText>
                                        Click a column header (like Inventory No., Name, Location) to sort the list.
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Open details</StepTitle>
                                    <StepText>
                                        Click an item row/card to open the item details page, where you can review its
                                        quantities, status, location, and more.
                                    </StepText>
                                </div>
                            </Step>
                        </Steps>

                        <VisualColumn>
                            {hasScreenshot ? (
                                <ScreenshotFigure aria-label="Inventory list screenshot">
                                    <ScreenshotImage
                                        src={FIND_ITEM_SCREENSHOT_SRC}
                                        alt="Inventory list view showing search, item cards, and actions"
                                        loading="lazy"
                                        decoding="async"
                                        onError={() => setHasScreenshot(false)}
                                    />
                                    <ScreenshotCaption>Inventory list view (search + actions)</ScreenshotCaption>
                                </ScreenshotFigure>
                            ) : (
                                <ScreenshotPlaceholder aria-label="Screenshot placeholder for inventory list">
                                    <ScreenshotTopBar>
                                        <Dot $color="#ef4444" />
                                        <Dot $color="#f59e0b" />
                                        <Dot $color="#10b981" />
                                    </ScreenshotTopBar>

                                    <ScreenshotBody>
                                        <PlaceholderIcon>
                                            <ImageIcon size={28} />
                                        </PlaceholderIcon>
                                        <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                        <PlaceholderText>
                                            Add <code>public/guide/find-item.png</code> to show the inventory screenshot.
                                        </PlaceholderText>
                                    </ScreenshotBody>
                                </ScreenshotPlaceholder>
                            )}

                            <TipsCard>
                                <TipsHeader>
                                    <Info size={16} />
                                    <span>Tips</span>
                                </TipsHeader>
                                <TipsList>
                                    <li>
                                        If you know where something is stored, filter/sort by <strong>Location</strong>.
                                    </li>
                                    <li>
                                        Use the <strong>damage status</strong> badge to spot items that need attention.
                                    </li>
                                </TipsList>
                            </TipsCard>
                        </VisualColumn>
                    </TaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const StyledContainer = styled(Container)`
    padding: 0 ${theme.spacing.xl} ${theme.spacing.xxl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xl};
`;

const IntroCard = styled(Card)`
    padding: ${theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
`;

const IntroTitle = styled.h3`
    margin: 0;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
`;

const IntroText = styled.p`
    margin: 0;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.base};
`;

const DetailHeader = styled.div`
    margin-bottom: ${theme.spacing.md};
`;

const BackToGuidesButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: transparent;
    padding: 6px 0;
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;

    &:hover {
        color: ${theme.colors.primary};
    }
`;

const TopicGrid = styled.div`
    margin-top: ${theme.spacing.sm};
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing.md};

    @media (max-width: ${theme.breakpoints.md}) {
        grid-template-columns: 1fr;
    }
`;

const TopicButton = styled.button<{ $available: boolean }>`
    text-align: left;
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border.default};
    background: ${theme.colors.background.white};
    padding: ${theme.spacing.lg};
    box-shadow: ${theme.shadows.sm};
    cursor: ${({ $available }) => ($available ? 'pointer' : 'not-allowed')};
    opacity: ${({ $available }) => ($available ? 1 : 0.65)};
    transition: ${theme.transitions.default};

    &:hover {
        transform: ${({ $available }) => ($available ? 'translateY(-1px)' : 'none')};
        box-shadow: ${({ $available }) => ($available ? theme.shadows.md : theme.shadows.sm)};
        border-color: ${({ $available }) => ($available ? theme.colors.primary : theme.colors.border.default)};
    }

    &:disabled {
        cursor: not-allowed;
    }
`;

const TopicHeader = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.sm};
`;

const TopicIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: ${theme.borderRadius.lg};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.light};
    border: 1px solid ${theme.colors.border.default};
    color: ${theme.colors.text.secondary};
    flex-shrink: 0;
`;

const TopicTitleRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing.sm};
    width: 100%;
`;

const TopicTitle = styled.div`
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.md};
`;

const TopicDescription = styled.div`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    line-height: 1.5;
`;

const TopicUnavailableHint = styled.div`
    margin-top: ${theme.spacing.sm};
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.sm};
`;

const TaskCard = styled(Card)`
    padding: ${theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xl};
`;

const TaskHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const TaskTitle = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.semibold};
    font-size: ${theme.typography.fontSize.lg};
`;

const IconPill = styled.span`
    width: 32px;
    height: 32px;
    border-radius: ${theme.borderRadius.round};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
`;

const TaskSubtitle = styled.p`
    margin: 0;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.base};
`;

const TaskGrid = styled.div`
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: ${theme.spacing.xl};

    @media (max-width: ${theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
    }
`;

const Steps = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
`;

const Step = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    align-items: flex-start;
`;

const StepIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: ${theme.borderRadius.lg};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.light};
    border: 1px solid ${theme.colors.border.default};
    color: ${theme.colors.text.secondary};
    flex-shrink: 0;
`;

const StepTitle = styled.div`
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: 2px;
`;

const StepText = styled.div`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    line-height: 1.5;
`;

const VisualColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
`;

const ScreenshotPlaceholder = styled.div`
    border-radius: ${theme.borderRadius.lg};
    border: 1px dashed ${theme.colors.border.default};
    background: ${theme.colors.background.light};
    overflow: hidden;
    box-shadow: ${theme.shadows.sm};
`;

const ScreenshotFigure = styled.figure`
    margin: 0;
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border.default};
    background: ${theme.colors.background.white};
    overflow: hidden;
    box-shadow: ${theme.shadows.sm};
`;

const ScreenshotImage = styled.img`
    width: 100%;
    height: auto;
    display: block;
`;

const ScreenshotCaption = styled.figcaption`
    padding: 10px 12px;
    border-top: 1px solid ${theme.colors.border.default};
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.sm};
`;

const ScreenshotTopBar = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    border-bottom: 1px solid ${theme.colors.border.default};
    background: ${theme.colors.background.white};
`;

const Dot = styled.span<{ $color: string }>`
    width: 10px;
    height: 10px;
    border-radius: ${theme.borderRadius.round};
    background: ${({ $color }) => $color};
    opacity: 0.9;
`;

const ScreenshotBody = styled.div`
    padding: 18px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
`;

const PlaceholderIcon = styled.div`
    width: 56px;
    height: 56px;
    border-radius: ${theme.borderRadius.round};
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.white};
    border: 1px solid ${theme.colors.border.default};
    color: ${theme.colors.text.muted};
`;

const PlaceholderTitle = styled.div`
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
`;

const PlaceholderText = styled.p`
    margin: 0;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.sm};
    line-height: 1.5;
`;

const TipsCard = styled.div`
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border.default};
    background: ${theme.colors.background.white};
    padding: ${theme.spacing.lg};
    box-shadow: ${theme.shadows.sm};
`;

const TipsHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.semibold};
    margin-bottom: ${theme.spacing.sm};
`;

const TipsList = styled.ul`
    margin: 0;
    padding-left: 18px;
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    display: flex;
    flex-direction: column;
    gap: 6px;

    strong {
        color: ${theme.colors.text.primary};
    }
`;

export default Guide;
