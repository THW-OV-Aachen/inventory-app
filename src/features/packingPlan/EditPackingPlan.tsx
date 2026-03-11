import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft } from 'lucide-react';
import { packingPlanApi } from '../../app/packingPlanApi';
import { EmergencyScenarioType } from '../../db/packingPlans';
import {
    Container,
    Card,
    FormGroup,
    Label,
    Input,
    Select,
    Textarea,
    Button,
    ContentWrapper,
    BackButton,
    Header,
    ButtonGroup,
} from '../../styles/components';
import { theme } from '../../styles/theme';

const StyledContainer = styled(Container)`
    padding-top: 8px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};

    @media (min-width: ${theme.breakpoints.lg}) {
        max-width: 960px;
        margin: 0 auto;
    }
`;

const StyledHeader = styled(Header)`
    padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 0;
    margin-bottom: 0;
    margin-left: 0;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
`;

const StyledBackButton = styled(BackButton)`
    padding-left: 0;
    margin-left: 0;
`;

const StyledContentWrapper = styled(ContentWrapper)`
    padding: 0;
`;

const StyledCard = styled(Card)`
    padding: ${theme.spacing.xl};
    box-shadow: ${theme.shadows.sm};
    border-radius: ${theme.borderRadius.lg};
    margin-top: 0;
`;

const StyledFormGroup = styled(FormGroup)`
    margin-bottom: ${theme.spacing.lg};
`;

const StyledButtonGroup = styled(ButtonGroup)`
    margin-top: ${theme.spacing.xl};
    width: 100%;
    flex-direction: row;
    gap: ${theme.spacing.md};
`;

const StyledButton = styled(Button)`
    height: 48px;
    font-size: ${theme.typography.fontSize.base};
    padding: 0 ${theme.spacing.xl};
`;

const ErrorText = styled.small`
    color: ${theme.colors.status.error.dark};
    display: block;
    margin-top: ${theme.spacing.xs};
`;

const getScenarioLabel = (scenarioType: EmergencyScenarioType): string => {
    switch (scenarioType) {
        case 'flood':
            return 'Hochwasser';
        case 'fire':
            return 'Feuer';
        case 'storm':
            return 'Sturm';
        case 'earthquake':
            return 'Erdbeben';
        case 'search_rescue':
            return 'Suche & Rettung';
        case 'custom':
            return 'Benutzerdefiniert';
        default:
            return scenarioType;
    }
};

const EditPackingPlan = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const plan = planId ? packingPlanApi.usePackingPlan(planId) : undefined;

    const [formData, setFormData] = useState<{
        name: string;
        scenarioType: EmergencyScenarioType;
        description: string;
    }>({
        name: '',
        scenarioType: EmergencyScenarioType.FLOOD,
        description: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                scenarioType: plan.scenarioType,
                description: plan.description || '',
            });
        }
    }, [plan]);

    const handleChange = (key: string, value: string | EmergencyScenarioType) => {
        setFormData((prev) => ({ ...prev, [key]: value }));

        if (errors[key]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name ist erforderlich.';
        }

        if (!formData.scenarioType) {
            newErrors.scenarioType = 'Szenario ist erforderlich.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm() || !planId) {
            return;
        }

        setIsSaving(true);

        try {
            await packingPlanApi.updatePackingPlan(planId, {
                name: formData.name.trim(),
                scenarioType: formData.scenarioType,
                description: formData.description.trim() || '',
            });

            navigate(-1);
        } catch (error) {
            console.error('Failed to update packing plan:', error);
            alert('Fehler beim Aktualisieren des Packplans.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderError = (key: string) => (errors[key] ? <ErrorText>{errors[key]}</ErrorText> : null);

    if (!plan) return null;

    return (
        <StyledContainer>
            <StyledHeader>
                <StyledBackButton onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} />
                </StyledBackButton>
            </StyledHeader>

            <StyledContentWrapper>
                <StyledCard>
                    <StyledFormGroup>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="z.B. Hochwasser"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        {renderError('name')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="scenarioType">Szenario</Label>
                        <Select
                            id="scenarioType"
                            name="scenarioType"
                            value={formData.scenarioType}
                            onChange={(e) => handleChange('scenarioType', e.target.value as EmergencyScenarioType)}
                        >
                            {Object.values(EmergencyScenarioType).map((type) => (
                                <option key={type} value={type}>
                                    {getScenarioLabel(type)}
                                </option>
                            ))}
                        </Select>
                        {renderError('scenarioType')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="description">Beschreibung</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Füge eine Beschreibung hinzu..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                        />
                    </StyledFormGroup>

                    <StyledButtonGroup>
                        <StyledButton $variant="ghost" onClick={() => navigate(-1)} disabled={isSaving}>
                            Abbrechen
                        </StyledButton>
                        <StyledButton $variant="primary" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Speichern...' : 'Speichern'}
                        </StyledButton>
                    </StyledButtonGroup>
                </StyledCard>
            </StyledContentWrapper>
        </StyledContainer>
    );
};

export default EditPackingPlan;
