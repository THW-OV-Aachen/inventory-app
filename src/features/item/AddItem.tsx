import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../db/db';
import { type IItem, type DamageLevelType, ItemValidationSchema } from '../../db/items';
import DamageLevelTranslation from '../../utils/damageLevels';

const AddItem = () => {
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Auto-grow textarea
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };
    useEffect(() => adjustTextareaHeight(), [formData.remark]);

    const validateField = async (key: keyof IItem, value: any) => {
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

    const handleChange = (key: keyof IItem, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (touched[key]) {
            validateField(key, value);
        }
    };

    const handleBlur = (key: keyof IItem) => {
        setTouched((prev) => ({ ...prev, [key]: true }));
        validateField(key, formData[key]);
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
            };

            await db.items.add(cleanedItem);
            navigate(`/items/${cleanedItem.id}`);
        } catch (err) {
            console.error(err);
            alert('Fehler beim Speichern des Gegenstands.');
        }
    };

    const RequiredStar = () => <span style={{ color: 'red' }}> *</span>;

    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">Gegenstand hinzufügen</h1>

            <div className="card rounded px-2 mb-4">
                <div className="table-responsive px-0">
                    <table className="table table-borderless mb-0">
                        <tbody>
                            <tr>
                                <th>
                                    Name:
                                    <RequiredStar />
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                                        value={formData.name ?? ''}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        onBlur={() => handleBlur('name')}
                                    />
                                    {touched.name && errors.name && (
                                        <small className="text-danger d-block mt-1">{errors.name}</small>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th className="w-50">
                                    Identifiktationsnummer:
                                    <RequiredStar />
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className={`form-control ${touched.id && errors.id ? 'is-invalid' : ''}`}
                                        value={formData.id ?? ''}
                                        onChange={(e) => handleChange('id', e.target.value)}
                                        onBlur={() => handleBlur('id')}
                                    />
                                    {touched.id && errors.id && (
                                        <small className="text-danger d-block mt-1">{errors.id}</small>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th>Inventarnummer:</th>
                                <td>
                                    <input
                                        type="text"
                                        className={`form-control ${touched.inventoryNumber && errors.inventoryNumber ? 'is-invalid' : ''}`}
                                        value={formData.inventoryNumber ?? ''}
                                        onChange={(e) => handleChange('inventoryNumber', e.target.value)}
                                        onBlur={() => handleBlur('inventoryNumber')}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>Gerätenummer:</th>
                                <td>
                                    <input
                                        type="text"
                                        className={`form-control ${touched.deviceNumber && errors.deviceNumber ? 'is-invalid' : ''}`}
                                        value={formData.deviceNumber ?? ''}
                                        onChange={(e) => handleChange('deviceNumber', e.target.value)}
                                        onBlur={() => handleBlur('deviceNumber')}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>Schaden:</th>
                                <td>
                                    <select
                                        className={`form-control ${touched.damageLevel && errors.damageLevel ? 'is-invalid' : ''}`}
                                        value={formData.damageLevel ?? 'none'}
                                        onChange={(e) => handleChange('damageLevel', e.target.value as DamageLevelType)}
                                        onBlur={() => handleBlur('damageLevel')}
                                    >
                                        <option value="none">{DamageLevelTranslation.none}</option>
                                        <option value="minor">{DamageLevelTranslation.minor}</option>
                                        <option value="major">{DamageLevelTranslation.major}</option>
                                        <option value="total">{DamageLevelTranslation.total}</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <th>Typ:</th>
                                <td>
                                    <select
                                        className={`form-control ${touched.isSet && errors.isSet ? 'is-invalid' : ''}`}
                                        value={formData.isSet ? 'yes' : 'no'}
                                        onChange={(e) => handleChange('isSet', e.target.value === 'yes')}
                                        onBlur={() => handleBlur('isSet')}
                                    >
                                        <option value="yes">Satz</option>
                                        <option value="no">(Einzelnes) Teil</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <th>Zielmenge:</th>
                                <td>
                                    <input
                                        type="number"
                                        className={`form-control ${touched.amountTarget && errors.amountTarget ? 'is-invalid' : ''}`}
                                        value={formData.amountTarget ?? ''}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            handleChange('amountTarget', v === '' ? undefined : Number(v));
                                        }}
                                        onBlur={() => handleBlur('amountTarget')}
                                    />
                                    {touched.amountTarget && errors.amountTarget && (
                                        <small className="text-danger d-block mt-1">{errors.amountTarget}</small>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th>Istmenge:</th>
                                <td>
                                    <input
                                        type="number"
                                        className={`form-control ${touched.amountActual && errors.amountActual ? 'is-invalid' : ''}`}
                                        value={formData.amountActual ?? ''}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            handleChange('amountActual', v === '' ? undefined : Number(v));
                                        }}
                                        onBlur={() => handleBlur('amountActual')}
                                    />
                                    {touched.amountActual && errors.amountActual && (
                                        <small className="text-danger d-block mt-1">{errors.amountActual}</small>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th>Verfügbarkeit:</th>
                                <td>
                                    <input
                                        type="number"
                                        className={`form-control ${touched.availability && errors.availability ? 'is-invalid' : ''}`}
                                        value={formData.availability ?? ''}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            handleChange('availability', v === '' ? undefined : Number(v));
                                        }}
                                        onBlur={() => handleBlur('availability')}
                                    />
                                    {touched.availability && errors.availability && (
                                        <small className="text-danger d-block mt-1">{errors.availability}</small>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th>Ort:</th>
                                <td>
                                    <input
                                        type="text"
                                        className={`form-control ${touched.location && errors.location ? 'is-invalid' : ''}`}
                                        value={formData.location ?? ''}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                        onBlur={() => handleBlur('location')}
                                    />
                                    {touched.location && errors.location && (
                                        <small className="text-danger d-block mt-1">{errors.location}</small>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th>Ebene:</th>
                                <td>
                                    <input
                                        type="number"
                                        className={`form-control ${touched.level && errors.level ? 'is-invalid' : ''}`}
                                        value={formData.level ?? ''}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            handleChange('level', v === '' ? undefined : Number(v));
                                        }}
                                        onBlur={() => handleBlur('level')}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>Letzte Inspektion:</th>
                                <td>
                                    <input
                                        type="date"
                                        className={`form-control ${touched.lastInspection && errors.lastInspection ? 'is-invalid' : ''}`}
                                        value={formData.lastInspection ?? ''}
                                        onChange={(e) => handleChange('lastInspection', e.target.value)}
                                        onBlur={() => handleBlur('lastInspection')}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>Inspektionsintervall (Monate):</th>
                                <td>
                                    <input
                                        type="number"
                                        className={`form-control ${
                                            touched.inspectionIntervalMonths && errors.inspectionIntervalMonths
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        value={formData.inspectionIntervalMonths ?? ''}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            handleChange('inspectionIntervalMonths', v === '' ? undefined : Number(v));
                                        }}
                                        onBlur={() => handleBlur('inspectionIntervalMonths')}
                                    />
                                    {touched.inspectionIntervalMonths && errors.inspectionIntervalMonths && (
                                        <small className="text-danger d-block mt-1">
                                            {errors.inspectionIntervalMonths}
                                        </small>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th>Kommentar:</th>
                                <td>
                                    <textarea
                                        ref={textareaRef}
                                        className={`form-control ${touched.remark && errors.remark ? 'is-invalid' : ''}`}
                                        value={formData.remark ?? ''}
                                        rows={3}
                                        style={{ resize: 'none' }}
                                        onChange={(e) => handleChange('remark', e.target.value)}
                                        onBlur={() => handleBlur('remark')}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-4">
                <button className="btn btn-success w-100" onClick={handleSave}>
                    Hinzufügen
                </button>
            </div>
        </div>
    );
};

export default AddItem;
