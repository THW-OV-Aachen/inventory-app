import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FileText, ChevronLeft, Plus, CheckCircle2, Settings } from 'lucide-react';
import { packingPlanApi } from '../../app/packingPlanApi';
import type { EmergencyScenarioType } from '../../db/packingPlans';
import { Card, Container, BackButton, Button } from '../../styles/components';
import { theme } from '../../styles/theme';
import IconContainer from '../../utils/IconContainer';
import { getIconComponent } from '../../utils/scenarioIcons';

const PackingPlanOverview = () => {
    const navigate = useNavigate();
    // Live list of saved packing plans from Dexie.
    const packingPlans = packingPlanApi.usePackingPlans();
    const scenarioTypes = packingPlanApi.useScenarioTypes();

    const handlePlanClick = (planId: string) => {
        navigate(`/packing-plans/${planId}`);
    };

    return (
        <StyledContainer>
            <Header>
                <HeaderLeft>
                    <StyledBackButton onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                    </StyledBackButton>
                    <Title>Packpläne</Title>
                </HeaderLeft>
                <HeaderRight>
                    <SettingsButton onClick={() => navigate('/packing-plans/scenarios')}>
                        <IconContainer icon={Settings} />
                        <span>Szenariotypen verwalten</span>
                    </SettingsButton>
                    <CreateButton $variant="primary" onClick={() =>
                                            navigate('/items', {
                                                state: {
                                                    packMode: true, 
                                                },
                                            })
                                        }>
                        <IconContainer icon={Plus} />
                        <span>Packplan erstellen</span>
                    </CreateButton>
                </HeaderRight>
            </Header>

            {packingPlans.length === 0 ? (
                <EmptyState>
                    <EmptyIconWrapper>
                        <IconContainer icon={FileText} />
                    </EmptyIconWrapper>
                    <EmptyStateTitle>Keine Packpläne vorhanden</EmptyStateTitle>
                    <EmptyStateText>
                        Erstelle deinen ersten Packplan, um dich auf den nächsten Notfall vorzubereiten.
                    </EmptyStateText>
                </EmptyState>
            ) : (
                <PlansGrid>
                    {packingPlans.map((plan) => {
                        const scenario = scenarioTypes.find(t => t.id === plan.scenarioType);
                        const Icon = scenario ? getIconComponent(scenario.icon) : getIconComponent('Package');
                        const scenarioLabel = scenario ? scenario.name : 'Unbekannt';

                        return (
                            <PlanCardItem 
                                key={plan.id} 
                                plan={plan} 
                                Icon={Icon} 
                                scenarioLabel={scenarioLabel} 
                                onClick={() => handlePlanClick(plan.id)} 
                            />
                        );
                    })}
                </PlansGrid>
            )}
        </StyledContainer>
    );
};

import type { ComponentType, SVGProps } from 'react';

const PlanCardItem = ({ 
    plan, 
    Icon, 
    scenarioLabel, 
    onClick 
}: { 
    plan: { id: string, name: string, description?: string, createdAt: string, scenarioType: EmergencyScenarioType }, 
    Icon: ComponentType<SVGProps<SVGSVGElement>>, 
    scenarioLabel: string, 
    onClick: () => void 
}) => {
    const planItems = packingPlanApi.usePackingPlanItems(plan.id);

    // Get packed state
    const packedStorageKey = `packingPlan:${plan.id}:packedItemIds`;
    const packedItemsSet = new Set<string>();
    
    try {
        const raw = localStorage.getItem(packedStorageKey);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                parsed.forEach(id => {
                    if (typeof id === 'string') packedItemsSet.add(id);
                });
            }
        }
    } catch {
        // safely ignore missing parsing errors
    }

    // Count how many valid plan items are packed
    const totalCount = planItems.length;
    const packedCount = planItems.filter((item) => packedItemsSet.has(item.Iid.toString())).length;
    const isFullyPacked = totalCount > 0 && packedCount === totalCount;
    const isPartiallyPacked = packedCount > 0 && !isFullyPacked;

    return (
        <PlanCard onClick={onClick}>
            <PlanCardHeader>
                <IconContainer icon={Icon} />
                <PlanTitle>
                    {plan.name}
                    {isFullyPacked && (
                        <PackedBadge $variant="full">
                            <IconContainer icon={CheckCircle2} />
                            gepackt
                        </PackedBadge>
                    )}
                    {isPartiallyPacked && (
                        <PackedBadge $variant="partial">
                            <IconContainer icon={CheckCircle2} />
                            angefangen
                        </PackedBadge>
                    )}
                </PlanTitle>
            </PlanCardHeader>
            <PlanMeta>
                <PlanMetaItem>
                    <PlanMetaLabel>Szenario:</PlanMetaLabel>
                    <PlanMetaValue>{scenarioLabel}</PlanMetaValue>
                </PlanMetaItem>
                {plan.description && (
                    <PlanDescription>{plan.description}</PlanDescription>
                )}
            </PlanMeta>
            <PlanFooter>
                <PlanDate>
                    Erstellt am {' '}
                    {new Date(plan.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </PlanDate>
            </PlanFooter>
        </PlanCard>
    );
};

// ─── Styled Components ────────────────────────────────────

const StyledContainer = styled(Container)`
    padding-top: 8px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};
    /* Removed max-width and margin: 0 auto to match ItemOverview full-width layout */
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${theme.spacing.lg} ${theme.spacing.xl} 0;
    margin-bottom: 0;
    gap: ${theme.spacing.md};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.sm} ${theme.spacing.lg} 0;
    }
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    flex: 1;
    min-width: 0;
`;

const StyledBackButton = styled(BackButton)`
    padding-left: 0;
    margin-left: 0;
    flex-shrink: 0;
`;

const Title = styled.h1`
    font-size: ${theme.typography.fontSize.xxl};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0;
    flex: 1;
    min-width: 0;
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
`;

const SettingsButton = styled(Button)`
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
    background-color: transparent;
    color: ${theme.colors.text.secondary};
    border: 1px solid ${theme.colors.border.default};
    
    &:hover {
        background-color: ${theme.colors.background.gray};
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        width: 36px;
        padding: 0;
        span {
            display: none;
        }
    }
`;

const CreateButton = styled(Button)`
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
    box-shadow: ${theme.shadows.sm};
    
    &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-1px);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        width: 36px;
        padding: 0;
        span {
            display: none;
        }
    }
`;

const PlansGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${theme.spacing.lg};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        grid-template-columns: 1fr;
    }
`;

const PlanCard = styled(Card)`
    cursor: pointer;
    transition: ${theme.transitions.default};
    display: flex;
    flex-direction: column;
    min-height: 180px;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.lg};
        border-color: ${theme.colors.primary};
    }
`;

const PlanCardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
`;

const PlanTitle = styled.h3`
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
`;

const PackedBadge = styled.span<{ $variant?: 'partial' | 'full' }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    background-color: ${props => props.$variant === 'partial' 
        ? theme.colors.status.good.light 
        : theme.colors.status.good.main};
    color: ${props => props.$variant === 'partial'
        ? theme.colors.status.good.dark
        : 'white'};
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.semibold};
    margin-left: auto;

    & svg {
        color: ${props => props.$variant === 'partial'
            ? theme.colors.status.good.dark
            : 'white'};
    }
`;

const PlanMeta = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.md};
`;

const PlanMetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
`;

const PlanMetaLabel = styled.span`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    font-weight: ${theme.typography.fontWeight.medium};
`;

const PlanMetaValue = styled.span`
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.primary};
`;

const PlanDescription = styled.p`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    margin: 0;
    line-height: 1.5;
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const PlanFooter = styled.div`
    padding-top: ${theme.spacing.md};
    border-top: 1px solid ${theme.colors.border.default};
    margin-top: auto;
`;

const PlanDate = styled.div`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.muted};
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.xxl} ${theme.spacing.xl};
    text-align: center;
    gap: ${theme.spacing.lg};
`;

const EmptyIconWrapper = styled.div`
    color: ${theme.colors.text.muted};
    opacity: 0.5;
`;

const EmptyStateTitle = styled.h2`
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0;
`;

const EmptyStateText = styled.p`
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.secondary};
    max-width: 500px;
    margin: 0;
    line-height: 1.6;
`;

export default PackingPlanOverview;

