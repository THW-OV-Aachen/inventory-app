import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import styled from 'styled-components';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { db } from '../../db/db';
import { type IItem, type DamageLevelType, ItemValidationSchema } from '../../db/items';
import { type ILabel } from '../../db/labels';
import DamageLevelTranslation from '../../utils/damageLevels';
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

const DropdownContainer = styled.div`
    position: relative;
`;

const DropdownButton = styled.button`
    width: 100%;
    padding: ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.base};
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border.default};
    background-color: ${theme.colors.background.light};
    color: ${theme.colors.text.primary};
    font-family: ${theme.typography.fontFamily};
    box-sizing: border-box;
    transition: ${theme.transitions.default};
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        background-color: ${theme.colors.background.white};
        box-shadow: 0 0 0 3px ${theme.colors.primaryLight};
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    width: 100%;
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.borderRadius.md};
    background-color: ${theme.colors.background.white};
    box-shadow: ${theme.shadows.md};
    margin-top: ${theme.spacing.sm};
    z-index: 10;
    padding: ${theme.spacing.sm};
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 150px;
    overflow-y: auto;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    padding: ${theme.spacing.sm};
    cursor: pointer;

    &:hover {
        background-color: ${theme.colors.background.light};
    }
`;

const CreateLabelContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    padding-top: ${theme.spacing.sm};
    border-top: 1px solid ${theme.colors.border.light};
    align-items: center;
`;

const ColorInput = styled(Input)`
    width: 48px;
    padding: 0;
    border-radius: 50%;
    height: 38px;
    border: none;
    cursor: pointer;
    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }
    &::-webkit-color-swatch {
        border: none;
        border-radius: 50%;
    }
`;

const AddItem = () => {
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<Partial<IItem>>({
        id: '',
        name: '',
        inventoryNumber: '',
        deviceNumber: '',
        isSet: false,
        amountTarget: 0,
        amountActual: 0,
        availability: 0,
        damageLevel: 'none',
        lastInspection: '',
        inspectionIntervalMonths: 0,
        location: '',
        level: 0,
        remark: '',
        labels: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [labels, setLabels] = useState<ILabel[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<ILabel[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState<string>(theme.colors.primary);

    useEffect(() => {
        const fetchLabels = async () => {
            const allLabels = await db.labels.toArray();
            setLabels(allLabels);
        };
        fetchLabels();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Auto-grow textarea
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };
    useEffect(() => adjustTextareaHeight(), [formData.remark]);

    const validateField = async (key: keyof IItem, value: string | number | boolean | ILabel[] | undefined) => {
        try {
            await ItemValidationSchema.validateAt(key, { ...formData, [key]: value });
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                setErrors((prev) => ({
                    ...prev,
                    [key]: error.message,
                }));
            }
        }
    };

    const handleChange = (key: keyof IItem, value: string | number | boolean | ILabel[] | undefined) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (touched[key]) {
            validateField(key, value);
        }
    };

    const handleBlur = (key: keyof IItem) => {
        setTouched((prev) => ({ ...prev, [key]: true }));
        validateField(key, formData[key]);
    };

    const handleCreateLabel = async () => {
        if (!newLabelName.trim()) return;

        const newLabel: ILabel = {
            id: crypto.randomUUID(),
            name: newLabelName.trim(),
            color: newLabelColor,
        };
        await db.labels.add(newLabel);
        setLabels((prev) => [...prev, newLabel]);
        setSelectedLabels((prev) => [...prev, newLabel]);
        setNewLabelName('');
    };

    const handleLabelSelection = (label: ILabel) => {
        setSelectedLabels((prev) => {
            if (prev.some((l) => l.id === label.id)) {
                return prev.filter((l) => l.id !== label.id);
            } else {
                return [...prev, label];
            }
        });
    };

    const handleSave = async () => {
        const allKeys = Object.keys(formData) as (keyof IItem)[];
        setTouched(allKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {}));

        try {
            await ItemValidationSchema.validate(formData, { abortEarly: false });

            const existing = await db.items.get(formData.id!.trim());
            if (existing) {
                setErrors((prev) => ({ ...prev, id: 'Ein Gegenstand mit dieser ID existiert bereits!' }));
                alert('Ein Gegenstand mit dieser ID existiert bereits!');
                return;
            }

            setErrors({});
            await saveItem();
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path] = err.message;
                    }
                });
                setErrors(newErrors);
            } else {
                console.error(error);
                alert('Fehler beim Speichern.');
            }
        }
    };

    const saveItem = async () => {
        try {
            const cleanedItem: IItem = {
                id: formData.id!.trim(),
                name: formData.name!.trim(),
                isSet: formData.isSet ?? false,
                amountTarget: formData.amountTarget ?? 0,
                amountActual: formData.amountActual ?? 0,
                availability: formData.availability ?? 0,
                damageLevel: formData.damageLevel ?? 'none',
                level: formData.level ?? 0,

                inventoryNumber: formData.inventoryNumber?.trim() || undefined,
                deviceNumber: formData.deviceNumber?.trim() || undefined,
                lastInspection: formData.lastInspection?.trim() || '',
                inspectionIntervalMonths: formData.inspectionIntervalMonths ?? 0,
                location: formData.location?.trim() || '',
                remark: formData.remark?.trim() || '',
                labels: selectedLabels,
            };

            await db.items.add(cleanedItem);
            navigate(`/items/${cleanedItem.id}`, { replace: true });
        } catch (err) {
            console.error(err);
            alert('Fehler beim Speichern des Gegenstands.');
        }
    };

    const RequiredStar = () => <span style={{ color: 'red' }}> *</span>;

    const renderError = (key: keyof IItem) =>
        touched[key] && errors[key] ? <ErrorText>{errors[key]}</ErrorText> : null;

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
                        <Label htmlFor="name">
                            Name
                            <RequiredStar />
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Name eingeben"
                            value={formData.name ?? ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            onBlur={() => handleBlur('name')}
                        />
                        {renderError('name')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="id">
                            Identifikationsnummer
                            <RequiredStar />
                        </Label>
                        <Input
                            id="id"
                            name="id"
                            type="text"
                            placeholder="ID eingeben"
                            value={formData.id ?? ''}
                            onChange={(e) => handleChange('id', e.target.value)}
                            onBlur={() => handleBlur('id')}
                        />
                        {renderError('id')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="labels">Labels</Label>
                        <DropdownContainer ref={dropdownRef}>
                            <DropdownButton type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <span>
                                    {selectedLabels.length > 0
                                        ? selectedLabels.map((l) => l.name).join(', ')
                                        : 'Labels auswählen'}
                                </span>
                                <ChevronDown size={16} />
                            </DropdownButton>
                            {isDropdownOpen && (
                                <DropdownMenu>
                                    <CheckboxContainer>
                                        {labels.map((label) => (
                                            <CheckboxLabel key={label.id}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLabels.some((l) => l.id === label.id)}
                                                    onChange={() => handleLabelSelection(label)}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                {label.name}
                                            </CheckboxLabel>
                                        ))}
                                    </CheckboxContainer>
                                    <CreateLabelContainer>
                                        <ColorInput
                                            type="color"
                                            value={newLabelColor}
                                            onChange={(e) => setNewLabelColor(e.target.value)}
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Neues Label erstellen"
                                            value={newLabelName}
                                            onChange={(e) => setNewLabelName(e.target.value)}
                                        />
                                        <StyledButton variant="primary" onClick={handleCreateLabel}>
                                            Erstellen
                                        </StyledButton>
                                    </CreateLabelContainer>
                                </DropdownMenu>
                            )}
                        </DropdownContainer>
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="inventoryNumber">Inventarnummer</Label>
                        <Input
                            id="inventoryNumber"
                            name="inventoryNumber"
                            type="text"
                            placeholder="Inventarnummer eingeben"
                            value={formData.inventoryNumber ?? ''}
                            onChange={(e) => handleChange('inventoryNumber', e.target.value)}
                            onBlur={() => handleBlur('inventoryNumber')}
                        />
                        {renderError('inventoryNumber')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="deviceNumber">Gerätenummer</Label>
                        <Input
                            id="deviceNumber"
                            name="deviceNumber"
                            type="text"
                            placeholder="Gerätenummer eingeben"
                            value={formData.deviceNumber ?? ''}
                            onChange={(e) => handleChange('deviceNumber', e.target.value)}
                            onBlur={() => handleBlur('deviceNumber')}
                        />
                        {renderError('deviceNumber')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="damageLevel">Schaden</Label>
                        <Select
                            id="damageLevel"
                            name="damageLevel"
                            value={formData.damageLevel ?? 'none'}
                            onChange={(e) => handleChange('damageLevel', e.target.value as DamageLevelType)}
                            onBlur={() => handleBlur('damageLevel')}
                        >
                            <option value="none">{DamageLevelTranslation.none}</option>
                            <option value="minor">{DamageLevelTranslation.minor}</option>
                            <option value="major">{DamageLevelTranslation.major}</option>
                            <option value="total">{DamageLevelTranslation.total}</option>
                        </Select>
                        {renderError('damageLevel')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="isSet">Typ</Label>
                        <Select
                            id="isSet"
                            name="isSet"
                            value={formData.isSet ? 'yes' : 'no'}
                            onChange={(e) => handleChange('isSet', e.target.value === 'yes')}
                            onBlur={() => handleBlur('isSet')}
                        >
                            <option value="yes">Satz</option>
                            <option value="no">(Einzelnes) Teil</option>
                        </Select>
                        {renderError('isSet')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="amountTarget">Zielmenge</Label>
                        <Input
                            id="amountTarget"
                            name="amountTarget"
                            type="number"
                            placeholder="Zielmenge eingeben"
                            value={formData.amountTarget ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('amountTarget', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('amountTarget')}
                        />
                        {renderError('amountTarget')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="amountActual">Istmenge</Label>
                        <Input
                            id="amountActual"
                            name="amountActual"
                            type="number"
                            placeholder="Istmenge eingeben"
                            value={formData.amountActual ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('amountActual', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('amountActual')}
                        />
                        {renderError('amountActual')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="availability">Verfügbarkeit</Label>
                        <Input
                            id="availability"
                            name="availability"
                            type="number"
                            placeholder="Verfügbarkeit eingeben"
                            value={formData.availability ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('availability', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('availability')}
                        />
                        {renderError('availability')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="location">Ort</Label>
                        <Input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="Ort eingeben"
                            value={formData.location ?? ''}
                            onChange={(e) => handleChange('location', e.target.value)}
                            onBlur={() => handleBlur('location')}
                        />
                        {renderError('location')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="level">Ebene</Label>
                        <Input
                            id="level"
                            name="level"
                            type="number"
                            placeholder="Ebene eingeben"
                            value={formData.level ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('level', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('level')}
                        />
                        {renderError('level')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="lastInspection">Letzte Inspektion</Label>
                        <Input
                            id="lastInspection"
                            name="lastInspection"
                            type="date"
                            value={formData.lastInspection ?? ''}
                            onChange={(e) => handleChange('lastInspection', e.target.value)}
                            onBlur={() => handleBlur('lastInspection')}
                        />
                        {renderError('lastInspection')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="inspectionIntervalMonths">Inspektionsintervall (Monate)</Label>
                        <Input
                            id="inspectionIntervalMonths"
                            name="inspectionIntervalMonths"
                            type="number"
                            placeholder="Intervall in Monaten"
                            value={formData.inspectionIntervalMonths ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('inspectionIntervalMonths', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('inspectionIntervalMonths')}
                        />
                        {renderError('inspectionIntervalMonths')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="remark">Kommentar</Label>
                        <Textarea
                            id="remark"
                            name="remark"
                            ref={textareaRef}
                            rows={3}
                            placeholder="Kommentar eingeben"
                            value={formData.remark ?? ''}
                            onChange={(e) => handleChange('remark', e.target.value)}
                            onBlur={() => handleBlur('remark')}
                            style={{ resize: 'none' }}
                        />
                        {renderError('remark')}
                    </StyledFormGroup>

                    <StyledButtonGroup>
                        <StyledButton variant="primary" onClick={handleSave}>
                            Hinzufügen
                        </StyledButton>
                        <StyledButton variant="ghost" onClick={() => navigate(-1)}>
                            Abbrechen
                        </StyledButton>
                    </StyledButtonGroup>
                </StyledCard>
            </StyledContentWrapper>
        </StyledContainer>
    );
};

export default AddItem;
