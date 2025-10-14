import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorDisplayProps {
    message: string
    onRetry?: () => void
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-md mx-auto">
                <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-destructive">
                        Something went wrong
                    </h2>
                    <p className="text-muted-foreground mb-4">{message}</p>
                    {onRetry && (
                        <Button onClick={onRetry} variant="outline">
                            Try Again
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}