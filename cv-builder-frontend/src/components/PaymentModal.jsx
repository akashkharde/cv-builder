import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";

const PaymentModal = ({ open, onClose, onSuccess, amount = "100" }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: "1234123412341234",
        cvv: "123",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Basic filtering for numbers only
        if ((name === "cardNumber" || name === "cvv") && !/^\d*$/.test(value)) {
            return;
        }
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (formData.cardNumber.length < 16) {
            newErrors.cardNumber = "Card number must be 16 digits";
        }
        if (formData.cvv.length < 3) {
            newErrors.cvv = "CVV must be 3 digits";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePay = () => {
        if (!validate()) return;

        setLoading(true);
        // Mock payment process
        setTimeout(() => {
            setLoading(false);
            onClose();
            // Call onSuccess after a short delay to allow the modal transition to finish
            setTimeout(() => {
                onSuccess();
            }, 300);
        }, 2000);
    };

    return (
        <Dialog open={open} onClose={loading ? null : onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                <Box className="flex items-center gap-2">
                    <LockIcon color="primary" />
                    <Typography variant="h6">Secure Payment</Typography>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box className="mb-6 text-center">
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Amount to Pay
                    </Typography>
                    <Typography variant="h4" color="primary" className="font-bold">
                        ₹{amount}
                    </Typography>
                </Box>

                <Box className="space-y-4">
                    <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        inputProps={{ maxLength: 16 }}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber || "Enter 16-digit card number"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CreditCardIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        type="password"
                        value={formData.cvv}
                        onChange={handleChange}
                        inputProps={{ maxLength: 3 }}
                        error={!!errors.cvv}
                        helperText={errors.cvv || "Enter 3-digit CVV found on back of card 123"}
                    />
                </Box>
            </DialogContent>
            <DialogActions className="p-4">
                <Button onClick={onClose} disabled={loading} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handlePay}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                    fullWidth
                    sx={{ py: 1.5 }}
                >
                    {loading ? "Processing..." : `Pay Now ₹${amount}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentModal;
