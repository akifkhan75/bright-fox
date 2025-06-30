import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AppContext } from '../../App';
import { UserRole } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
// import ShieldCheckIcon from '../../assets/icons/ShieldCheckIcon';
// import DocumentArrowUpIcon from '../../assets/icons/DocumentArrowUpIcon';
// import InformationCircleIcon from '../../assets/icons/InformationCircleIcon';
// import * as DocumentPicker from 'expo-document-picker';

const TeacherVerificationScreen: React.FC = () => {
  const context = useContext(AppContext);
  
//   const [idFile, setIdFile] = useState<DocumentPicker.DocumentResult | null>(null);
//   const [certificateFile, setCertificateFile] = useState<DocumentPicker.DocumentResult | null>(null);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!context || !context.teacherProfile || context.appState.currentUserRole !== UserRole.Teacher) {
    return (
      <View style={styles.deniedContainer}>
        <Text>Access Denied. Please log in as a teacher.</Text>
      </View>
    );
  }

  const { teacherProfile, submitTeacherVerification } = context;

  const currentStatus = teacherProfile.verificationStatus || 'NotSubmitted';
  const canSubmit = currentStatus === 'NotSubmitted' || currentStatus === 'Rejected';

//   const pickDocument = async (type: 'id' | 'certificate') => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ['image/*', 'application/pdf'],
//       });
      
//       if (result.type === 'success') {
//         if (type === 'id') {
//           setIdFile(result);
//         } else {
//           setCertificateFile(result);
//         }
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Failed to pick document');
//     }
//   };

//   const handleSubmitVerification = async () => {
//     if (!canSubmit) {
//       Alert.alert("Verification", "You have already submitted documents or are verified.");
//       return;
//     }
    
//     if (!idFile && !portfolioLink) {
//       Alert.alert("Verification", "Please upload an ID document or provide a portfolio link.");
//       return;
//     }

//     setIsSubmitting(true);
    
//     const documentsData = {
//       idFileName: idFile?.name,
//       certificateFileName: certificateFile?.name,
//       portfolioLink: portfolioLink,
//     };
    
//     const success = await submitTeacherVerification(teacherProfile.id, documentsData);
//     setIsSubmitting(false);
    
//     if (!success) {
//       Alert.alert("Submission Failed", "Please try again.");
//     }
//   };

  const statusMessages = {
    NotSubmitted: "Please submit your documents for verification to start offering paid courses.",
    Pending: "Your documents are under review. This usually takes 3-5 business days. We'll notify you via email.",
    Verified: "Congratulations! You are a verified teacher. You can now publish paid courses.",
    Rejected: "There was an issue with your previous submission. Please review any feedback and resubmit corrected documents.",
  };

  const statusColors = {
    NotSubmitted: { bg: '#f3f4f6', text: '#374151' },
    Pending: { bg: '#fef3c7', text: '#92400e' },
    Verified: { bg: '#d1fae5', text: '#065f46' },
    Rejected: { bg: '#fee2e2', text: '#991b1b' },
  };

  const formatStatus = (status: string) => {
    return status.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.mainCard}>
        <View style={styles.header}>
          {/* <ShieldCheckIcon width={32} height={32} fill="#ea580c" /> */}
          <Text style={styles.title}>Teacher Verification Center</Text>
        </View>

        <Card style={[styles.statusCard, { backgroundColor: statusColors[currentStatus].bg }]}>
          <Text style={[styles.statusText, { color: statusColors[currentStatus].text }]}>
            Current Status: {formatStatus(currentStatus)}
          </Text>
          <Text style={styles.statusMessage}>{statusMessages[currentStatus]}</Text>
        </Card>

        {canSubmit ? (
          <View style={styles.formContainer}>
            <Text style={styles.description}>
              To ensure a safe and high-quality learning environment, we require teachers to verify their identity and qualifications.
            </Text>

            <View style={styles.uploadSection}>
              <Text style={styles.label}>Government-Issued ID (e.g., Driver's License, Passport)</Text>
              <TouchableOpacity 
                style={styles.uploadBox}
                onPress={() => pickDocument('id')}
              >
                {/* <DocumentArrowUpIcon width={40} height={40} fill="#9ca3af" /> */}
                <Text style={styles.uploadText}>Upload a file</Text>
                <Text style={styles.uploadHint}>PNG, JPG, PDF up to 5MB</Text>
                {idFile && <Text style={styles.fileName}>Selected: {idFile.name}</Text>}
              </TouchableOpacity>
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.label}>Teaching Certificates / Diplomas (Optional)</Text>
              <TouchableOpacity 
                style={styles.uploadBox}
                onPress={() => pickDocument('certificate')}
              >
                {/* <DocumentArrowUpIcon width={40} height={40} fill="#9ca3af" /> */}
                <Text style={styles.uploadText}>Upload files</Text>
                <Text style={styles.uploadHint}>PNG, JPG, PDF</Text>
                {/* {certificateFile && <Text style={styles.fileName}>Selected: {certificateFile.name}</Text>} */}
              </TouchableOpacity>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Portfolio Link (Optional - e.g., LinkedIn, Personal Website)</Text>
              <TextInput
                style={styles.input}
                value={portfolioLink}
                onChangeText={setPortfolioLink}
                placeholder="https://..."
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.infoBox}>
              {/* <InformationCircleIcon width={20} height={20} fill="#1d4ed8" /> */}
              <Text style={styles.infoText}>
                All submitted documents are handled securely and confidentially, used solely for verification purposes. Please ensure your uploads are clear and legible.
              </Text>
            </View>

            <Button
            //   onPress={handleSubmitVerification}
              onPress={() => {}}
              style={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                // <LoadingSpinner size="small" />
                <Text>loading</Text>
              ) : (
                <Text style={styles.submitButtonText}>Submit Documents for Verification</Text>
              )}
            </Button>
          </View>
        ) : null}

        {currentStatus === 'Verified' && (
          <View style={styles.verifiedContainer}>
        {/* <ShieldCheckIcon width={48} height={48} fill="#10b981" /> */}
            <Text style={styles.verifiedText}>You're all set and verified!</Text>
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  deniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mainCard: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ea580c',
    marginLeft: 8,
  },
  statusCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusMessage: {
    fontSize: 12,
    marginTop: 4,
  },
  formContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
  },
  uploadSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 6,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  fileName: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 8,
    fontStyle: 'italic',
  },
  inputSection: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#1e40af',
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#ea580c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 16,
  },
  verifiedContainer: {
    alignItems: 'center',
    marginTop: 24,
    padding: 16,
  },
  verifiedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    marginTop: 8,
  },
});

export default TeacherVerificationScreen;